# Publishing

Panduan publish **SpeexJS** ke npm.

## Prasyarat

```bash
npm login
npm whoami        # pastikan sudah login
```

## Step-by-step

```bash
# 1. Build
npm run build

# 2. Bump versi
npm version patch -m "chore: bump version to %s"

# 3. Verifikasi
npm pack --dry-run

# 4. Publish
npm publish
```

## Semantic Versioning

| Command | Efek |
|---------|------|
| `npm version patch` | Bug fix (0.0.x) |
| `npm version minor` | Fitur baru (0.x.0) |
| `npm version major` | Breaking change (x.0.0) |

## Tag Khusus

```bash
npm publish --tag beta       # speexjs@beta
npm publish --tag alpha      # speexjs@alpha
```

## Troubleshooting

| Error | Solusi |
|-------|--------|
| `403 Forbidden` | Cek akses & login |
| `402 Payment Required` | Setup 2FA |
| `Package name exists` | Update versi |
| Build error | Perbaiki error TypeScript |

## Rollback

Gunakan deprecate, bukan unpublish (kecuali < 72 jam):

```bash
npm deprecate speexjs@0.2.0 "Ada bug kritis. Upgrade ke 0.2.1"
```
