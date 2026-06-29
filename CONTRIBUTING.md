# Contributing

Thank you for considering contributing to **SpeexJS**!

## Bug Reports & Feature Requests

- Report bugs via GitHub Issues
- Use the available templates

## Pull Requests

1. Fork and clone the repo
2. Create a branch: feat/name or fix/name
3. Follow the coding standards below
4. Write tests and ensure all pass
5. Use Conventional Commits
6. Push and open a PR

## Development Setup

```bash
git clone https://github.com/superdevids/speexjs.git
cd speexjs
pnpm install
cd packages/speexkit
npm run build
npm test
```

## Coding Standards

- TypeScript strict — no any, use unknown
- Zero runtime dependencies
- Tests — Vitest, minimum 80% coverage
- Format — Biome (2 spaces, single quotes)

MIT
