import type { GlobalConfig } from 'semantic-release';

const Config: GlobalConfig = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/itsmeid/release-example-002',
  tagFormat: 'v${version}',
  dryRun: true,
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          {
            type: 'feat',
            release: 'minor'
          },
          {
            type: 'fix',
            release: 'patch'
          },
          {
            scope: 'no-release',
            release: false
          }
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE']
        }
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features', hidden: false },
            { type: 'fix', section: 'Fixes', hidden: false },
            { type: 'docs', section: 'Documentations', hidden: false },
            { type: 'perf', section: 'Improvements', hidden: false },
            { type: 'chore', section: 'Others', hidden: false },
            { type: 'build', hidden: true },
            { type: 'ci', hidden: true },
            { type: 'refactor', hidden: true },
            { type: 'style', hidden: true },
            { type: 'test', hidden: true }
          ]
        },
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE']
        }
      }
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: '.'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: ['dist/**', 'package.json', 'LICENSE', 'README.md']
      }
    ]
  ]
};

export default Config;
