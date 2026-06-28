# Publikasi — SpeexJS Core

## Prasyarat

```bash
npm login
# Pastikan terautentikasi dengan akun npm yang memiliki akses publish
```

## Cara Publish

```bash
cd packages/core

# 1. Build
npx tsup

# 2. Test
npx vitest run

# 3. Bump versi (pilih salah satu)
npm version patch   # perbaikan bug (0.x.1)
npm version minor   # fitur baru (0.1.0)
npm version major   # breaking change (1.0.0)

# 4. Build ulang
npx tsup

# 5. Publish
npm publish

# 6. Commit + push
git add -A
git commit -m "chore: release v$(node -p \"require('./packages/core/package.json').version\")"
git push origin master
```

## Checklist Sebelum Publish

- [ ] `npx tsup` — build sukses
- [ ] `npx vitest run` — semua test passing
- [ ] `npm login` — sudah login
- [ ] CHANGELOG.md sudah diupdate
- [ ] Versi di `package.json` sudah sesuai

## Mengatasi Error

| Error | Solusi |
|-------|--------|
| `403 Forbidden` | Cek akses ke package: `npm access ls-collaborators speexjs-core` |
| `402 EOTP` | Butuh OTP — tambahkan `--otp=123456` |
| `Unscoped packages` | Pastikan package name sudah benar |
| `npm version` gagal | Pastikan working tree bersih (`git status`) |
