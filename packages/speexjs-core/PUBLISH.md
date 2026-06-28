# Publishing — SpeexJS Core (v0.8.0)

## Prerequisites

```bash
npm login
# Ensure you are authenticated with an npm account that has publish access
```

## Version Bump

Choose the appropriate bump based on changes:

```bash
npm version patch   # Bug fixes (0.7.x → 0.7.1)
npm version minor   # New features, backwards-compatible (0.7.0 → 0.8.0)
npm version major   # Breaking changes (0.x.0 → 1.0.0)
```

This updates `package.json` and creates a git tag automatically.

## Pre-Publish Checklist

Before publishing, verify everything is clean:

- [ ] `npx biome check src/` — lint passes with no errors
- [ ] `npx tsc --noEmit` — TypeScript strict mode passes
- [ ] `npx tsup` — build completes successfully (ESM, declarations, sourcemaps)
- [ ] `npx vitest run` — all **1167+ tests** pass
- [ ] `npm login` — authenticated on npm
- [ ] `CHANGELOG.md` — updated with new entries for this release
- [ ] `package.json` — version field matches the intended release

## Publish Steps

```bash
cd packages/speexjs-core

# 1. Bump version (patch / minor / major)
npm version minor

# 2. Rebuild
npx tsup

# 3. Run tests one final time
npx vitest run

# 4. Publish to npm
npm publish

# 5. Commit and push (including the git tag)
git add -A
git commit -m "chore: release v$(node -p \"require('./package.json').version\")"
git push origin master --tags
```

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `403 Forbidden` | No publish access | Run `npm access ls-collaborators speexjs-core` to verify |
| `402 EOTP` | One-time password required | Add `--otp=XXXXXX` to the publish command |
| `ERR_PUBLISH_CONFLICT` | Version already exists | Bump the version (`npm version patch`) and retry |
| `npm version` fails | Dirty working tree | Commit or stash pending changes, then retry |
| `ERR_SSL_DECRYPT_ERROR` | Network / registry issue | Retry with `npm config set registry https://registry.npmjs.org/` |
| Build succeeds but types missing | tsup entry missed | Verify the module is listed in `tsup.config.ts` `entry` array |
