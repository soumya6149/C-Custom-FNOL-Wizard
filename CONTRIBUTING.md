# Contributing to CC-Custom-FNOL-Wizard

Thank you for your interest in contributing! This is a portfolio project
showcasing real Guidewire ClaimCenter customization patterns.

## How to Contribute

### Reporting Issues
- Open a GitHub Issue with a clear title and description
- Include your ClaimCenter version (9.x / 10.x / Cloud)
- Attach relevant PCF or Gosu snippets if applicable

### Submitting Changes
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-improvement`
3. Follow the existing PCF/Gosu coding conventions
4. Add or update unit tests in `gsrc/gw/fnol/test/`
5. Submit a Pull Request with a clear description of changes

## Code Style Guidelines

### Gosu
- Use `camelCase` for method and variable names
- Use `PascalCase` for class names
- Add Javadoc-style comments on all public methods
- Keep methods focused — single responsibility

### PCF
- Use `DisplayKey` for ALL user-visible strings (never hardcode labels)
- Group related fields in named `InputSet` blocks
- Add XML comments explaining business rules at each section

### Rule Sets (.grs)
- Each rule must have a `<Description>` block
- Name rules descriptively (what they check, not just an ID)
- Prefer `Error` for blocking rules, `Warning` for advisory rules

## Questions?
Open a GitHub Discussion or reach out via LinkedIn.
