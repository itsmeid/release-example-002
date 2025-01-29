import conventionalCommitsChangelog from 'conventional-changelog-conventionalcommits';
import type { Options as WriterOptions } from 'conventional-changelog-writer';
import type { ParserOptions } from 'conventional-commits-parser';
import type { GlobalConfig, PluginSpec } from 'semantic-release';

const changelogPreset = await conventionalCommitsChangelog({
  types: [
    { type: 'feat', section: 'Features', hidden: false },
    { type: 'fix', section: 'Fixes', hidden: false },
    {
      type: 'perf',
      section: 'Performance Improvements',
      hidden: false
    },
    { type: 'docs', section: 'Documentations', hidden: false },
    { type: 'revert', section: 'Reverts', hidden: false },
    {
      type: 'chore',
      scope: 'release',
      section: 'Others',
      hidden: false
    },
    { type: 'build', hidden: true },
    { type: 'chore', hidden: true },
    { type: 'ci', hidden: true },
    { type: 'refactor', hidden: true },
    { type: 'style', hidden: true },
    { type: 'test', hidden: true }
  ]
});

const isDryRun = process.argv.includes('--dry-run');

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
            { revert: true, release: 'patch' },
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
          parserOpts: {
            ...changelogPreset.parser,
            headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
            breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
            headerCorrespondence: ['type', 'scope', 'subject'],
            noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
            notesPattern: (noteKeywords: string) => {
              return new RegExp(`^[\\s|*]*(${noteKeywords})[:\\s]+(.*)`);
            },
            revertPattern:
              /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
            revertCorrespondence: ['header', 'hash'],
            issuePrefixes: ['#']
          } as ParserOptions,
          writerOpts: {
            ...(changelogPreset.writer as unknown as WriterOptions),
            transform: (commit, context, _options) => {
              const commitObj = commit as typeof commit & {
                scope: string | null;
              };

              const result: Partial<typeof commitObj> = {
                ...changelogPreset.writer.transform(commitObj, context)
              };

              if (commitObj.scope === 'release') {
                result.scope = null;
              }

              if (commitObj.notes.length) {
                const generateNewNotes = () => {
                  const notes = commitObj.notes.map((note) => {
                    let newText = '';

                    const lines = note.text.split('\n');

                    for (let i = 0; i < lines.length; i++) {
                      const line = lines[i];

                      const matchesTrailer = line.match(
                        /^([A-Za-z0-9-]+):\s(.+)$/
                      );

                      if (matchesTrailer) {
                        break;
                      }

                      newText += `${line}\n`;
                    }

                    return {
                      ...note,
                      title: 'BREAKING CHANGE',
                      text: newText.trim()
                    };
                  });

                  result.notes = notes;
                };

                generateNewNotes();
              }

              return result;
            }
          } as WriterOptions
        }
      ],
      [
        '@semantic-release/changelog',
        {
          changelogFile: 'RELEASE_NOTES.md'
        }
      ]
    ]
  };

  if (!isDryRun) {
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

    (result.plugins as PluginSpec[]).push(
      [
        '@semantic-release/exec',
        {
          generateNotesCmd: `${Object.values(generateCmd).join(' && ')}`
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
          addReleases: 'bottom'
        }
      ]
    );
  }

  return result;
};

const config = getConfig();

export default config;
