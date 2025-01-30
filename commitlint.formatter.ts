import { formatResult } from '@commitlint/format';
import type {
  FormatOptions,
  FormattableResult,
  Formatter,
  WithInput
} from '@commitlint/types';
import { Chalk } from 'chalk';

type TCommitResult = FormattableResult & WithInput;

const { CHECK_PR_TITLE, CI } = process.env;
const isCheckPrTitle = CHECK_PR_TITLE && ['1', 'true'].includes(CHECK_PR_TITLE);
const isCI = CI && ['1', 'true'].includes(CI);
const _n = isCI ? '%0A' : '\n';
const chalk = new Chalk({ level: isCI ? 0 : 2 });
const reference = `Reference: ${chalk.blue.underline('https://www.conventionalcommits.org')}`;

const newLine = (x = 1) => {
  let result = '';

  for (let i = 0; i < x; i++) {
    result += _n;
  }

  return result;
};

const getReportHeader = (commitMesage: string, hasError: boolean) => {
  const header = `${chalk.white.bold('✉️ Commit Message')}${newLine(2)}${chalk.white(commitMesage)}${newLine(2)}`;

  if (isCI) {
    const msgType = hasError ? '::error' : '::warning';
    const ghAnn = `${msgType} ::${header.replaceAll('\n', _n)}`;

    return ghAnn;
  }

  return header;
};

const getReportProblemList = (
  commitResult: TCommitResult,
  options: FormatOptions,
  isValid: boolean
) => {
  if (isValid) {
    const list = `${chalk.green('✔')} all good ${chalk.gray('[passed]')}`;
    const summary = chalk.bold(
      `${chalk.green('✔')} Summary: found 0 problems, 0 warnings`
    );
    return `${list}${newLine(2)}${summary}`;
  }

  if (isCheckPrTitle && commitResult.input) {
    const filterProblem = (type: 'warnings' | 'errors') => {
      return (
        commitResult[type]?.filter((problem) => {
          const name = problem.name as string;

          if (name.includes('body-')) {
            return false;
          }

          if (name.includes('footer-')) {
            return false;
          }

          return true;
        }) ?? []
      );
    };

    commitResult.errors = filterProblem('errors');
    commitResult.warnings = filterProblem('warnings');
  }

  return formatResult(commitResult, {
    ...options,
    verbose: false
  })
    .slice(0, -1)
    .join(_n)
    .replace('   found', ' Summary: found')
    .replaceAll('   ', ' ');
};

const formatCommitReport = (
  commitResult: TCommitResult,
  options: FormatOptions
) => {
  const commitMessage = commitResult.input || '';
  const hasError = Boolean(commitResult.errors?.length);
  const hasWarning = Boolean(commitResult.warnings?.length);
  const isValid = !hasError && !hasWarning;

  if (isCI && isValid) {
    return '';
  }

  const header = getReportHeader(commitMessage, hasError);
  const problemList = getReportProblemList(commitResult, options, isValid);
  const footer = `${newLine(2)}${reference}`;

  return `${header}${problemList}${footer}`;
};

const formatter: Formatter = (report, options) => {
  const results = report.results;

  if (!results) {
    return 'Result not found';
  }

  const temp: string[] = [];
  for (const commitReport of results) {
    const formatted = formatCommitReport(commitReport, options);

    if (formatted) {
      temp.push(formatted);
    }
  }

  const text = isCI
    ? temp.join('\n')
    : temp.join('\n\n--------------------------------------\n\n');

  return text;
};

export default formatter;
