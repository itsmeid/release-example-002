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

const formatText = (
  isValid: boolean,
  result: FormattableResult & WithInput,
  options: FormatOptions
) => {
  const header = chalk.white.bold(result.input);
  const reference = `Reference: ${chalk.blue.underline('https://www.conventionalcommits.org/en/v1.0.0')}`;

  const getList = () => {
    if (isValid) {
      const list = `${chalk.green('✔')} all good ${chalk.gray('[passed]')}`;
      const summary = chalk.bold(
        `${chalk.green('✔')} Summary: found 0 problems, 0 warnings`
      );
      return `${list}${n}${n}${summary}`;
    }

    const list = formatResult(result, {
      ...options,
      verbose: false
    })
      .slice(0, -1)
      .join(n)
      .replace('   found', ' Summary: found')
      .replaceAll('   ', ' ');

    return list;
  };

  return `${header}${n}${n}${getList()}${n}${n}${reference}`;
};

const formatter: Formatter = (report, options) => {
  const results = report.results;

  if (!results) {
    return 'Result not found';
  }

  const temp: string[] = [];
  for (const result of results) {
    const hasError = Boolean(result.errors?.length);
    const hasWarning = Boolean(result.warnings?.length);
    const isValid = !hasError && !hasWarning;

    if (CI) {
      if (isValid) {
        continue;
      }

      const message = formatText(isValid, result, { ...options, color: false });
      const ann = hasError ? '::error' : '::warning';
      const title =
        hasError && hasWarning
          ? 'error & warning'
          : hasError
            ? 'error'
            : hasWarning
              ? 'warning'
              : '';
      temp.push(`${ann} title=Commit message ${title}::${message}`);
    } else {
      const message = formatText(isValid, result, options);
      temp.push(message);
    }
  }

  const text = CI
    ? temp.join('\n')
    : temp.join('\n\n--------------------------------------\n\n');

  return text;
};

export default formatter;
