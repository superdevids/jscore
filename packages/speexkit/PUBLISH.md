# Publishing

## Prerequisites

```bash
npm login
npm whoami
```

## Step-by-Step

```bash
# 1. Build
npm run build

# 2. Bump version
npm version patch -m "chore: bump version to %s"

# 3. Verify
npm pack --dry-run

# 4. Publish
npm publish
```

## Semantic Versioning

| Command | Effect |
|---------|--------|
| npm version patch | Bug fix (0.0.x) |
| npm version minor | New feature (0.x.0) |
| npm version major | Breaking change (x.0.0) |
