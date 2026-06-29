# Contributing

Thank you for considering contributing to **SpeexKit**!

## Bug Reports & Feature Requests

- Report bugs via GitHub Issues
- Include SpeexKit version, Node.js version, OS, and reproduction code

## Pull Requests

1. Fork and clone the repo
2. Create a branch: feat/name or fix/name
3. Follow the coding standards
4. Write tests and ensure all pass
5. Use Conventional Commits
6. Push and open a PR

## Development Setup

```bash
git clone https://github.com/superdevids/speexjs.git
cd speexjs/packages/speexkit
npm install
npm run build
npm test
```

## Coding Standards

- TypeScript strict — no any, use unknown
- Zero runtime dependencies
- JSDoc with @param, @returns, @example for all exports
- Biome linter: 2-space indent, 120 width, single quotes
- Tests required before committing

## Adding a Module

1. Create src/<module>/ with index.ts
2. Add entry to tsup.config.ts
3. Add export path to package.json
4. Write tests in tests/<module>.test.ts
5. Run npm run build && npm test
6. Update SUMMARY.md

## License

By contributing, you agree that your contributions are MIT licensed.
