import type { RulesConfig, UserConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import type { ParserOptions } from 'conventional-commits-parser';

const { CHECK_PR_TITLE } = process.env;
const isCheckPrTitle = CHECK_PR_TITLE && ['1', 'true'].includes(CHECK_PR_TITLE);

const getConfig = () => {
  const result: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        RuleConfigSeverity.Error,
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
      ],
      'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
      'footer-leading-blank': [RuleConfigSeverity.Error, 'always']
    },
    formatter: './commitlint.formatter.ts',
    parserPreset: {
      parserOpts: {
        headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
        breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        fieldPattern: /^-(.*?)-$/,
        noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
        notesPattern: (noteKeywordsSelection: string) => {
          return new RegExp(`^[\\s|*]*(${noteKeywordsSelection})[:\\s]+(.*)`);
        },
        revertPattern:
          /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
        revertCorrespondence: ['header', 'hash'],
        issuePrefixes: ['#']
      } as ParserOptions
    },
    helpUrl: ''
  };

  const rules = result.rules as Partial<RulesConfig>;
  if (isCheckPrTitle) {
    result.plugins = [
      {
        rules: {
          'pr-title-header-only': (parsedCommit) => {
            if (Boolean(parsedCommit.body) || Boolean(parsedCommit.footer)) {
              return [false, 'only header is allowed (for PR title only)'];
            }

            return [true];
          },
          'pr-title-breaking-change': (parsedCommit) => {
            const rawCommit = parsedCommit.raw ?? '';

            if (
              rawCommit.includes('\nBREAKING CHANGE:') ||
              rawCommit.includes('\nBREAKING-CHANGE:')
            ) {
              return [
                false,
                'use ! instead of footer token for breaking change (for PR title only)'
              ];
            }

            return [true];
          }
        }
      }
    ];
    rules['pr-title-header-only'] = [RuleConfigSeverity.Error, 'always'];
    rules['pr-title-breaking-change'] = [RuleConfigSeverity.Warning, 'always'];
  }

  return result;
};

const config = getConfig();

export default config;
