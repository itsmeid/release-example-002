import type { GlobalConfig } from 'semantic-release';

const Config: GlobalConfig = {
  branches: ['main', { name: 'dev', prerelease: true }],
  repositoryUrl: 'https://github.com/itsmeid/release-example-002',
  tagFormat: 'v${version}',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          {
            breaking: true,
            release: 'major'
          },
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
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
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
            { type: 'docs', section: 'Miscellaneous', hidden: false },
            { type: 'chore', section: 'Miscellaneous', hidden: false }
          ]
        },
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
        }
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
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
        assets: [
          'dist/**',
          'package.json',
          'LICENSE',
          'README.md',
          'CHANGELOG.md'
        ]
      }
    ]
  ]
};

export default Config;
