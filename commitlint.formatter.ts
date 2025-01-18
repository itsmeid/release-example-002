import { formatResult } from '@commitlint/format';
import type {
  FormatOptions,
  FormattableResult,
  Formatter,
  WithInput
} from '@commitlint/types';
import { Chalk } from 'chalk';

const CI = [true, 'true', 1, '1'].includes(process.env.CI || '');
const chalk = new Chalk({ level: CI ? 0 : 2 });
const n = CI ? '%0A' : '\n';
const reference = `Reference: ${chalk.blue.underline('https://www.conventionalcommits.org')}`;

const formatText = (
  result: FormattableResult & WithInput,
  options: FormatOptions
) => {
  const hasError = Boolean(result.errors?.length);
  const hasWarning = Boolean(result.warnings?.length);
  const isValid = !hasError && !hasWarning;

  if (CI && isValid) {
    return '';
  }

  const getHeader = () => {
    const commitMsg = chalk.white.bold(result.input);
    const header = `${commitMsg}${n}${n}`;

    if (CI) {
      const ann = hasError ? '::error' : '::warning';
      return `${ann} ::${header}`;
    }

    return header;
  };

  const getList = () => {
    if (isValid) {
      const list = `${chalk.green('✔')} all good ${chalk.gray('[passed]')}`;
      const summary = chalk.bold(
        `${chalk.green('✔')} Summary: found 0 problems, 0 warnings`
      );
      return `${list}${n}${n}${summary}`;
    }

    return formatResult(result, {
      ...options,
      verbose: false
    })
      .slice(0, -1)
      .join(n)
      .replace('   found', ' Summary: found')
      .replaceAll('   ', ' ');
  };

  const header = getHeader();
  const list = getList();
  const footer = `${n}${n}${reference}`;

  return `${header}${list}${footer}`;
};

const formatter: Formatter = (report, options) => {
  const results = report.results;

  if (!results) {
    return 'Result not found';
  }

  const temp: string[] = [];
  for (const result of results) {
    const formatted = formatText(result, options);

    if (formatted) {
      temp.push(formatted);
    }
  }

  const text = CI
    ? temp.join('\n')
    : temp.join('\n\n--------------------------------------\n\n');

  return text;
};

export default formatter;
