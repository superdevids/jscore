# Contributing

Terima kasih ingin berkontribusi ke **SpeexJS**!

## Laporan Bug & Fitur

- Laporkan bug via [GitHub Issues](https://github.com/superdevids/speexjs/issues)
- Gunakan template yang tersedia
- Sertakan versi SpeexJS, Node.js, OS, dan kode reproduksi

## Pull Request

1. Fork & clone repo
2. Buat branch: `feat/nama` atau `fix/nama`
3. Ikuti coding standards
4. Tulis test, pastikan semua lulus (`npm test`)
5. Gunakan [Conventional Commits](https://www.conventionalcommits.org/)
6. Push & buat PR ke branch `main`

## Development Setup

```bash
git clone https://github.com/superdevids/speexjs.git
cd speexjs
npm install
npm run build
npm test
```

## Coding Standards

- **TypeScript strict** — no `any`, gunakan `unknown`
- **Zero runtime dependencies** — semua native
- **Test** — Vitest, minimal 80% coverage
- **Format** — Biome (2 spasi, single quotes, semicolon)
- **File** — kebab-case, class PascalCase, function camelCase
- **Import** — gunakan path `speexjs/*`, contoh: `from 'speexjs/server'`

## Struktur

```
speexjs/
├── src/
│   ├── schema/     # Validasi
│   ├── server/     # Server framework
│   ├── client/     # Client framework
│   ├── rpc/        # Type-safe RPC
│   ├── cli/        # CLI commands
│   └── native/     # Core helpers (zero-dep)
└── tests/
```

## Lisensi

Dengan berkontribusi, Anda setuju kontribusi Anda dilisensikan di bawah [MIT License](LICENSE).
