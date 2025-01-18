import type { GlobalConfig, PluginSpec } from 'semantic-release';

const isDryRun = process.argv.includes('--dry-run');
const generateCmd = {
  releases:
    'echo ${JSON.stringify(releases)} > .semantic-release.releases.json',
  lastRelease:
    'echo ${JSON.stringify(lastRelease)} > .semantic-release.lastRelease.json',
  lastGitTag:
    'printf "%s" ${lastRelease.gitTag} > .semantic-release.lastRelease.gitTag',
  lastVersion:
    'printf "%s" ${lastRelease.version} > .semantic-release.lastRelease.version',
  nextRelease:
    'echo ${JSON.stringify(nextRelease)} > .semantic-release.nextRelease.json',
  nextGitTag:
    'printf "%s" ${nextRelease.gitTag} > .semantic-release.nextRelease.gitTag',
  nextVersion:
    'printf "%s" ${nextRelease.version} > .semantic-release.nextRelease.version',
  type: 'printf "%s" ${nextRelease.type} > .semantic-release.nextRelease.type'
};

const getConfig = () => {
  const result: GlobalConfig = {
    branches: ['main'],
    repositoryUrl: 'https://github.com/itsmeid/release-example-002',
    tagFormat: 'v${version}',
    plugins: [
      [
        '@semantic-release/commit-analyzer',
        {
          preset: 'conventionalcommits',
          releaseRules: [
            { breaking: true, release: 'major' },
            { revert: true, release: 'patch' },
            {
              type: 'feat',
              release: 'minor'
            },
            {
              type: 'fix',
              release: 'patch'
            },
            {
              type: 'perf',
              release: 'patch'
            },
            {
              type: 'chore',
              scope: 'release',
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
              {
                type: 'chore',
                scope: 'release',
                section: 'Others',
                hidden: false
              },
              { type: 'feat', section: 'Features', hidden: false },
              { type: 'fix', section: 'Fixes', hidden: false },
              { type: 'docs', section: 'Documentations', hidden: false },
              {
                type: 'perf',
                section: 'Performance Improvements',
                hidden: false
              },
              { type: 'revert', section: 'Reverts', hidden: false },
              { type: 'build', hidden: true },
              { type: 'chore', hidden: true },
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
        '@semantic-release/changelog',
        {
          changelogFile: 'RELEASE_NOTES.md'
        }
      ],
      [
        '@semantic-release/exec',
        {
          generateNotesCmd: `${Object.values(generateCmd).join(' && ')}`
        }
      ]
    ]
  };

  if (!isDryRun) {
    (result.plugins as PluginSpec[]).push(
      [
        '@semantic-release/npm',
        {
          pkgRoot: '.'
        }
      ],
      [
        '@semantic-release/github',
        {
          addReleases: 'bottom'
        }
      ]
    );
  }

  return result;
};

const config = getConfig();

export default config;
