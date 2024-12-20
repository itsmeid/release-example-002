[7:04:29 PM] [semantic-release] » i  Running semantic-release version 24.2.1
[7:04:30 PM] [semantic-release] » √  Loaded plugin "verifyConditions" from "@semantic-release/npm"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "verifyConditions" from "@semantic-release/github"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "analyzeCommits" from "@semantic-release/commit-analyzer"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "generateNotes" from "@semantic-release/release-notes-generator"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "prepare" from "@semantic-release/npm"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "publish" from "@semantic-release/npm"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "publish" from "@semantic-release/github"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "addChannel" from "@semantic-release/npm"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "addChannel" from "@semantic-release/github"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "success" from "@semantic-release/github"
[7:04:30 PM] [semantic-release] » √  Loaded plugin "fail" from "@semantic-release/github"
[7:04:38 PM] [semantic-release] » √  Allowed to push to the Git repository
[7:04:38 PM] [semantic-release] » i  Start step "verifyConditions" of plugin "@semantic-release/npm"
[7:04:38 PM] [semantic-release] [@semantic-release/npm] » i  Verify authentication for registry https://registry.npmjs.org/
[7:04:38 PM] [semantic-release] [@semantic-release/npm] » i  Reading npm config from C:\Users\Dev\.npmrc
itsmeid
[7:04:39 PM] [semantic-release] » √  Completed step "verifyConditions" of plugin "@semantic-release/npm"
[7:04:39 PM] [semantic-release] » i  Start step "verifyConditions" of plugin "@semantic-release/github"
[7:04:39 PM] [semantic-release] [@semantic-release/github] » i  Verify GitHub authentication
[7:04:40 PM] [semantic-release] » √  Completed step "verifyConditions" of plugin "@semantic-release/github"
[7:04:40 PM] [semantic-release] » i  No git tag version found on branch main
[7:04:40 PM] [semantic-release] » i  No previous release found, retrieving all commits
[7:04:40 PM] [semantic-release] » i  Found 2 commits since last release
[7:04:40 PM] [semantic-release] » i  Start step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
[7:04:40 PM] [semantic-release] [@semantic-release/commit-analyzer] » i  Analyzing commit: chore!: tester message
[7:04:40 PM] [semantic-release] [@semantic-release/commit-analyzer] » i  The release type for the commit is major
[7:04:40 PM] [semantic-release] [@semantic-release/commit-analyzer] » i  Analysis of 2 commits complete: major release
[7:04:40 PM] [semantic-release] » √  Completed step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
[7:04:40 PM] [semantic-release] » i  There is no previous release, the next release version is 1.0.0
[7:04:41 PM] [semantic-release] » i  Start step "generateNotes" of plugin "@semantic-release/release-notes-generator"
[7:04:41 PM] [semantic-release] » √  Completed step "generateNotes" of plugin "@semantic-release/release-notes-generator"
[7:04:41 PM] [semantic-release] » √  Published release 1.0.0 on default channel
[7:04:41 PM] [semantic-release] » i  Release note for version 1.0.0:
## 1.0.0 (2025-01-13)

### ⚠ BREAKING CHANGES

    * tester message

### Others

    * initial (60693c3 (https://github.com/itsmeid/release-example-002/commit/60693c3d463fe8bbc246111e8d78128defb8f926))
    * tester message (42a1195 (https://github.com/itsmeid/release-example-002/commit/42a1195bf5d1bbc8f31558993758a8fee80ce864))

