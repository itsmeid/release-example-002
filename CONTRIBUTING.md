# Contributing

First of all, thank you for considering contributing to this project!

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion for improvement, please open an issue in the [Issues](https://github.com/itsmeid/release-example-002/issues) section of the repository.

### Submitting Pull Request

1. Follow the [Development Guidelines](#development-guidelines) to ensure your contribution aligns with project standards.
2. Create a fork of the repository on GitHub.
3. Create a branch for your changes (e.g., `feature/add-new-feature`).
4. Implement your changes in the newly created branch.
5. Add or update spec file based on your changes. Ensure your changes don't break anything and all tests pass.
6. Add or update code documentation based on your changes. Regenerate the documentation files if changes were made to code documentation.
7. Commit your changes.
8. Push your changes to your forked repository.
9. Open a pull request from your branch to the `main` branch of the original repository.

## Development Guidelines

### Commit Message

- Provide a clear and descriptive commit message.
- Use [conventional commits](https://www.conventionalcommits.org) format. Example formats:

  - `feat: add new feature`
  - `fix: correct bug in feature`
  - `chore: update dependencies`
  - `docs: update documentation`
  - `refactor: improve code readability`
  - [More examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)

### Pull Request

- Provide a clear and descriptive title for your PR and use [conventional commits](https://www.conventionalcommits.org) format for the title. Example formats:

  - `feat: add new feature`
  - `feat!: add new breaking change feature` (use `!` instead of footer token for breaking change)

- Write a concise description of the changes made and why they are necessary.
- Include any relevant issue numbers (e.g., "Closes #123").
- Ensure your code adheres to the project’s coding standards.
- Update documentation if applicable to reflect your changes.

### Git Hooks

- Use [Husky](https://github.com/typicode/husky) to implement Git hooks.
- Avoid skipping or disabling any hooks (e.g., using `-n`, `--no-verify`, etc.).

### Code Environment

- This project uses [Bun](https://bun.sh/) for development. Make sure it is installed and set up in your workspace.
- For Windows users, it's recommended to have [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) installed.
- It's recommended to use a modern code editor (e.g., [VSCode](https://code.visualstudio.com/), [Atom](https://atom-editor.cc/), etc.) to enhance your coding experience.

### Code Style

- Follow the existing coding style and conventions in this repository.
- Ensure your code passes all linting and formatting checks.

### Type Definitions

- Ensure type definitions are accurate and appropriately defined for all variables, functions, and parameters.
- Avoid using `any` whenever possible. If it is necessary, provide a clear explanation in a comment explaining why it is being used.

### Documentation

- Write doc comments for code documentations with [TSDoc](https://github.com/microsoft/tsdoc).
- After updating code documentations, run `bun out:docs` to regenerate the documentation files (no need to manually update the documentation files).

### Testing

- Write tests to verify your code works as expected.
- Ensure all existing tests pass before submitting your PR.
- Use `bun test` to run tests locally.

### Coverage

- Code coverage (runtime) should meet the project's required thresholds.
- Type coverage (compile time) should meet the project's required thresholds.

## Code of Conduct

By participating in this project, you agree to follow our [Code of Conduct](https://github.com/itsmeid/release-example-002/blob/main/CODE_OF_CONDUCT.md).

---

Thank you for contributing!
