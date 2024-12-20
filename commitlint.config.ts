import type { UserConfig } from '@commitlint/types';

const Config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      1,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  },
  formatter: './commitlint.formatter.ts',
  helpUrl: ''
};

export default Config;
