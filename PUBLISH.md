# Publishing Guide

> **Monorepo:** This project contains two independently versioned npm packages.
> Each package is published separately under its own npm scope.

---

## Table of Contents

- [Package Overview](#package-overview)
- [Prerequisites](#prerequisites)
- [Publishing Workflow](#publishing-workflow)
- [Versioning Strategy](#versioning-strategy)
- [Pre-Release Channels](#pre-release-channels)
- [CI/CD Publishing](#cicd-publishing)
- [Rollback & Deprecation](#rollback--deprecation)
- [Troubleshooting](#troubleshooting)

---

## Package Overview

| Package | npm Name | Current Version | Path |
|---------|----------|-----------------|------|
| **speexjs** | [`speexjs`](https://www.npmjs.com/package/speexjs) | 1.6.x | `./packages/speexjs` |
| **speexkit** | [`speexkit`](https://www.npmjs.com/package/speexkit) | 1.4.x | `./packages/speexkit` |

Both packages are **independently versioned** and published separately. A change to one package does not require a release of the other.

---

## Prerequisites

### 1. npm Account

```bash
# Login to npm (ensure you have publish access to both packages)
npm login

# Verify authentication
npm whoami
```

### 2. Build & Test Verification

Before any publish, verify the target package is clean:

```bash
# For speexjs
cd packages/speexjs
npm run lint && npm run typecheck && npm run build && npm test

# For speexkit
cd packages/speexkit
npm run lint && npm run typecheck && npm run build && npm test
```

### 3. Checklist

- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles with 0 errors (`tsc --noEmit`)
- [ ] Lint passes with 0 warnings (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] CHANGELOG.md is updated for the new version
- [ ] Version is bumped in `package.json`
- [ ] `npm pack --dry-run` shows the correct files
- [ ] npm login is verified

---

## Publishing Workflow

### Manual Publish (Recommended)

#### speexjs

```bash
cd packages/speexjs

# 1. Update CHANGELOG.md with release notes
# 2. Bump version (choose one):
npm version patch -m "chore: bump speexjs to %s"   # bug fix
npm version minor -m "chore: bump speexjs to %s"   # new feature
npm version major -m "chore: bump speexjs to %s"   # breaking change

# 3. Build
npm run build

# 4. Verify package contents
npm pack --dry-run

# 5. Publish to npm
npm publish

# 6. Push tags to GitHub
git push origin master --tags
```

#### speexkit

```bash
cd packages/speexkit

# 1. Update CHANGELOG.md
# 2. Bump version
npm version patch -m "chore: bump speexkit to %s"

# 3. Build
npm run build

# 4. Verify
npm pack --dry-run

# 5. Publish
npm publish

# 6. Push tags
git push origin master --tags
```

### Post-Publish Verification

```bash
# Verify the published version
npm view speexjs version
npm view speexkit version

# Test installing in a fresh directory
mkdir -p /tmp/test-publish && cd /tmp/test-publish
npm init -y
npm install speexjs@latest
npm install speexkit@latest
```

---

## Versioning Strategy

Both packages follow [Semantic Versioning 2.0.0](https://semver.org/):

| Version Bump | When | Example |
|-------------|------|---------|
| **Patch** | Bug fixes, performance improvements, documentation changes | `1.0.0` → `1.0.1` |
| **Minor** | New features, non-breaking API additions | `1.0.0` → `1.1.0` |
| **Major** | Breaking API changes, significant architecture changes | `1.0.0` → `2.0.0` |

### Pre-Release Suffixes

| Suffix | Purpose | npm Tag |
|--------|---------|---------|
| `-alpha.1` | Early development, unstable API | `alpha` |
| `-beta.1` | Feature-complete, testing phase | `beta` |
| `-rc.1` | Release candidate, final verification | `next` |

---

## Pre-Release Channels

```bash
# Alpha release
npm version prerelease --preid alpha
npm publish --tag alpha

# Beta release
npm version prerelease --preid beta
npm publish --tag beta

# Release candidate
npm version prerelease --preid rc
npm publish --tag next

# Promote to latest
npm dist-tag add speexjs@1.2.3-beta.0 latest
```

Users can install pre-release versions:

```bash
npm install speexjs@beta
npm install speexkit@alpha
```

---

## CI/CD Publishing

The project uses GitHub Actions for automated CI. Publishing is currently a **manual step** triggered by a maintainer.

### Future Automation (Planned)

```yaml
# .github/workflows/publish.yml (conceptual)
on:
  push:
    tags:
      - 'speexjs-v*'
      - 'speexkit-v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Rollback & Deprecation

### Deprecate (Recommended)

Use deprecation for most rollback scenarios. The package remains installable but shows a warning:

```bash
# Deprecate a specific version
npm deprecate speexjs@1.2.0 "Critical bug in authentication. Upgrade to 1.2.1."

# Deprecate an entire range
npm deprecate speexjs@"<1.3.0" "Security vulnerability fixed in 1.3.0."
```

### Unpublish (Last Resort)

Only possible within 72 hours of publish:

```bash
# Unpublish a specific version
npm unpublish speexjs@1.2.0

# Unpublish entire package (extreme)
npm unpublish speexjs -f
```

> **Warning:** Unpublishing can cause breaking changes for users. Always prefer deprecation.

### Git Tag Management

```bash
# Delete a remote tag (if version was tagged but not published)
git push --delete origin speexjs-v1.2.0

# Delete a local tag
git tag -d speexjs-v1.2.0
```

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `403 Forbidden` | No publish access | Verify npm login and package access: `npm access ls-packages` |
| `402 Payment Required` | 2FA not configured | Enable 2FA on npm: `npm profile enable-2fa auth-and-writes` |
| `ENEEDAUTH` | Session expired | Run `npm login` again |
| `Package name exists` | Version conflict | Bump version or check if name needs updating |
| `E401` | Invalid token | Regenerate npm token or re-authenticate |
| Build error | TypeScript/build issue | Run `npm run build` locally and fix errors |
| Test failure | Code regression | Run `npm test` and fix failing tests |
| `E403` `npm ERR! code E403` | Package scoped to org | Ensure you are a member of the npm organization |
| Package missing files | `files` field in package.json | Check the `files` array includes `dist/` and required assets |

---

## Per-Package Guides

For package-specific publishing instructions:

- [speexjs PUBLISH.md](./packages/speexjs/PUBLISH.md)
- [speexkit PUBLISH.md](./packages/speexkit/PUBLISH.md)
