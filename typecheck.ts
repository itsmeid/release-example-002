import { $, type ShellError } from 'bun';
import { Chalk } from 'chalk';

const { CI } = process.env;
const isCI = CI === '1' || CI === 'true';
const chalk = new Chalk({ level: isCI ? 0 : 2 });
const tscErrorPatterns = [
  {
    regex: /^(.*)\((\d+),(\d+)\): error (TS\d+): (.*)$/,
    keys: ['file', 'line', 'column', 'errorCode', 'message']
  },
  {
    regex: /^(.*)\((\d+),(\d+)\): error (.*)$/,
    keys: ['file', 'line', 'column', 'message']
  },
  {
    regex: /^(.*\.ts)\((\d+),(\d+)\): (.*)$/,
    keys: ['file', 'line', 'column', 'message']
  },
  {
    regex: /^error (TS\d+): (.*)$/,
    keys: ['errorCode', 'message']
  },
  {
    regex: /^(.*)$/,
    keys: ['message']
  }
];

const parseTscError = (log: string) => {
  for (const pattern of tscErrorPatterns) {
    const match = log.match(pattern.regex);
    if (match) {
      const result: TParsedError = {};

      pattern.keys.forEach((key, index) => {
        const val = match[index + 1];
        result[key as keyof TParsedError] = val;
      });

      return result;
    }
  }

  return null;
};

const typeCheck = async () => {
  let result = '';
  let exitCode = 0;

  const errorDiagnostics = (
    await $`bunx tsc -p tsconfig.json --pretty ${!isCI}`
      .text()
      .catch((err: ShellError) => {
        exitCode = err.exitCode;
        return err.stdout.toString();
      })
  ).trim();

  if (isCI) {
    const lines = errorDiagnostics.split(/\r?\n/);
    let isFirst = true;

    for (const line of lines) {
      if (line) {
        const parsedError = parseTscError(line.trim());

        if (parsedError) {
          if (!isFirst) {
            const isNextAnnotation = Object.keys(parsedError).length !== 1;
            const _n = isNextAnnotation ? '\n' : '%0A';
            result += _n;

            if (!isNextAnnotation) {
              result += parsedError.message;
              continue;
            }
          }

          const title = `TS Error ${parsedError.errorCode ? `(${parsedError.errorCode})` : ''}`;
          result += `::error title=${title}`;

          if (parsedError.file) {
            result += `,file=${parsedError.file}`;
          }

          if (parsedError.line) {
            result += `,line=${parsedError.line},endLine=${parsedError.line}`;
          }

          if (parsedError.column) {
            result += `,col=${parsedError.column}`;
          }

          result += `::${parsedError.message}`;

          if (isFirst) {
            isFirst = false;
          }
        }
      }
    }
  } else {
    result = errorDiagnostics;
  }

  const isResultEmpty = !result;
  if (isResultEmpty) {
    result = chalk.bold(`${chalk.green('✓')} No errors found in typecheck.`);
  }

  return {
    result,
    exitCode
  };
};

const parseTypeCheckOptions = (options: TOptions) => {
  let result = '';

  const add = (key: string, value: string | boolean | number) => {
    if (value === false) {
      return;
    }

    const val = value === true ? '' : ` ${value}`;
    result += ` --${key}${val}`;
  };

  for (const [key, value] of Object.entries(options)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        add(key, `"${v}"`);
      }

      continue;
    }

    add(key, value);
  }

  return result;
};

const typeCoverage = async (options: TOptions) => {
  let result = '';
  let exitCode = 0;

  if (options['at-least']) {
    options['at-least'] = undefined;
  }

  const parsedOptions = parseTypeCheckOptions(options);
  const coverage: TCoverageResult =
    await $`bunx type-coverage ${parsedOptions} --json-output`
      .json()
      .catch((err: ShellError) => {
        exitCode = err.exitCode;
        return err.json();
      });

  const isSuccess = coverage.succeeded;

  const printResult = isSuccess ? chalk.green : chalk.red;

  result += `Coverage: ${printResult(`${coverage.percent}%`)}\n`;
  result += `Expected: ${coverage.atLeast}%\n`;
  result += `Covered Count: ${coverage.correctCount}\n`;
  result += `Total Count: ${coverage.totalCount}\n`;

  if (isCI) {
    if (coverage.error) {
      result += `::error ::${coverage.error}`;
    }

    if (coverage.details?.length) {
      for (const detail of coverage.details) {
        result += '\n';

        const title = 'Untyped Error';
        result += `::error title=${title}`;
        result += `,file=${detail.filePath}`;
        result += `,line=${detail.line + 1},endLine=${detail.line + 1}`;
        result += `,col=${detail.character + 1}`;
        result += `::${detail.text.replaceAll(/\r?\n/g, '%0A')}`;
      }

      result += '\n';
    }
  } else {
    if (coverage.error) {
      result += `${chalk.bold.red(coverage.error)}\n`;
    }

    if (coverage.details?.length) {
      for (const detail of coverage.details) {
        result += '\n';
        result += `${detail.filePath}(${detail.line + 1},${detail.character + 1}): ${detail.text}`;
      }

      result += '\n';
    }
  }

  return {
    result,
    exitCode
  };
};

const main = async () => {
  const typeCheckStart = performance.now();
  const { result: typeCheckResult, exitCode: typeCheckExitCode } =
    await typeCheck();
  const { result: typeCoverageResult, exitCode: typeCoverageExitCode } =
    await typeCoverage({
      strict: true,
      detail: true,
      project: 'tsconfig.json',
      'ignore-as-assertion': true,
      'ignore-catch': true,
      'ignore-nested': false,
      'show-relative-path': true,
      'report-semantic-error': false
    });
  const typeCheckEnd = performance.now();

  console.info(typeCheckResult);
  console.info('\n--------------------');
  console.info(typeCoverageResult);

  console.info(
    `type check completed in ${chalk.bold(`${(typeCheckEnd - typeCheckStart).toFixed(2)}ms`)}.`
  );

  if (typeCheckExitCode !== 0) {
    process.exit(typeCheckExitCode === 2 ? 1 : typeCheckExitCode);
  }

  if (typeCoverageExitCode !== 0) {
    process.exit(typeCoverageExitCode);
  }
};

main();

type TParsedError = {
  file?: string;
  line?: string;
  column?: string;
  errorCode?: string;
  message?: string;
};

type TOptions = Partial<{
  'at-least': number;
  is: number;
  cache: boolean;
  debug: boolean;
  detail: boolean;
  'ignore-catch': boolean;
  'ignore-files': string | string[];
  project: string;
  strict: boolean;
  'suppress-error': boolean;
  update: boolean;
  'update-if-higher': boolean;
  'ignore-unread': boolean;
  'ignore-nested': boolean;
  'ignore-as-assertion': boolean;
  'ignore-type-assertion': boolean;
  'ignore-non-null-assertion': boolean;
  'ignore-object': boolean;
  'ignore-empty-type': boolean;
  'show-relative-path': boolean;
  'history-file': string;
  'no-detail-when-failed': boolean;
  'report-semantic-error': boolean;
  'cache-directory': string;
  'not-only-in-cwd': boolean;
  'json-output': boolean;
  'report-unused-ignore': boolean;
}>;

type TCoverageResult = {
  succeeded: boolean;
  details?: {
    character: number;
    filePath: string;
    line: number;
    text: string;
  }[];
  atLeast: number;
  atLeastFailed: boolean;
  correctCount: number;
  is?: number;
  isFailed?: boolean;
  percent: number;
  percentString: string;
  totalCount: number;
  error?: string;
};
