import { $ } from 'bun';
import { Chalk } from 'chalk';
import conventionalCommitsChangelog from 'conventional-changelog-conventionalcommits';
import type { Options as WriterOptions } from 'conventional-changelog-writer';
import type { ParserOptions } from 'conventional-commits-parser';
import type { NextRelease, Options, PluginSpec } from 'semantic-release';
import semanticRelease from 'semantic-release';

const { CI, GITHUB_ACTIONS } = process.env;
const isCI = CI && ['1', 'true'].includes(CI);
const isGHA = GITHUB_ACTIONS && ['1', 'true'].includes(GITHUB_ACTIONS);
const isDryRun = !isCI || process.argv.includes('--dry-run');
const isGenerateOutputFiles = process.argv.includes('--generate-output-files');
const isGenerateGhaSummary = process.argv.includes('--generate-gha-summary');
const chalk = new Chalk({ level: isCI ? 0 : 2 });

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

const parserOpts: ParserOptions = {
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
};

const writerOpts: WriterOptions = {
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

            const matchesTrailer = line.match(/^([A-Za-z0-9-]+):\s(.+)$/);

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
} as WriterOptions;

const options: Options = (() => {
  const plugins: PluginSpec[] = [
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
        parserOpts,
        writerOpts
      }
    ]
  ];

  if (!isDryRun) {
    plugins.push(
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

  return {
    branches: ['main'],
    repositoryUrl: 'https://github.com/itsmeid/release-example-002',
    tagFormat: 'v${version}',
    plugins
  };
})();

const generateSummaryContent = (nextRelease: NextRelease) => {
  const content = `## 🚀 Release Report
- Type: ${nextRelease.type}
- Version: ${nextRelease.version}
- Tag: ${nextRelease.gitTag}

See this release at this [link](${options.repositoryUrl}/releases/tag/${nextRelease.gitTag}).

## 📝 Generated Notes
${nextRelease.notes}`;

  return content;
};

const runRelease = async () => {
  try {
    const result = await semanticRelease(options);

    console.info('--------------------------------------------------\n');

    if (!result) {
      console.info('No release published.');
      return;
    }

    const { commits, releases, lastRelease, nextRelease } = result;

    if (isGenerateGhaSummary || isGenerateOutputFiles) {
      const summary = generateSummaryContent(nextRelease);

      if (isGenerateGhaSummary) {
        console.info('Generating github step summary...');
        if (isGHA) {
          await $`printf "%s" "${summary}" >> $GITHUB_STEP_SUMMARY`;
          console.info('> $GITHUB_STEP_SUMMARY');
        } else {
          console.info('> GHA environment not detected. (skipped)');
        }
        console.info();
      }

      if (isGenerateOutputFiles) {
        console.info('Generating output files...');
        await $`printf "%s" "${summary}" > .auto-release.summary.md`;
        console.info('> .auto-release.summary.md');
        await $`echo ${JSON.stringify(commits)} > .auto-release.commits.json`;
        console.info('> .auto-release.commits.json');
        await $`echo ${JSON.stringify(releases)} > .auto-release.releases.json`;
        console.info('> .auto-release.releases.json');
        await $`echo ${JSON.stringify(lastRelease)} > .auto-release.lastRelease.json`;
        console.info('> .auto-release.lastRelease.json');
        await $`echo ${JSON.stringify(nextRelease)} > .auto-release.nextRelease.json`;
        console.info('> .auto-release.nextRelease.json');
        console.info();
      }

      console.info('--------------------------------------------------\n');
    }

    console.info(`${chalk.bold('Release Report')}\n`);
    console.info(`Type: ${nextRelease.type}`);
    console.info(`Version: ${nextRelease.version}`);
    console.info(`Tag: ${nextRelease.gitTag}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${err.name}:`, `${chalk.white(err.message)}`);
    }

    process.exit(1);
  }
};

const main = async () => {
  const startTime = performance.now();
  await runRelease();
  const endTime = performance.now();
  console.info(
    `\nauto release completed in ${chalk.bold(`${(endTime - startTime).toFixed(2)}ms`)}.`
  );
};

main();
