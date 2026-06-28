# Kontribusi — SpeexJS Core

Terima kasih tertarik berkontribusi! Berikut panduan singkatnya.

## Setup Development

```bash
cd packages/core
npm install
npx tsup        # build
npx vitest run  # test (828+ tests)
```

## Coding Standards

- TypeScript strict mode — tidak boleh ada `any` eksplisit
- Zero runtime dependencies
- Setiap fungsi publik harus memiliki unit test
- Gunakan JSDoc untuk dokumentasi fungsi
- Format kode dengan Biome (`npx biome check --write`)

## Menambahkan Fungsi Baru

1. Tentukan module yang sesuai (`src/<module>/`)
2. Implementasi fungsi + export dari `index.ts`
3. Tambah unit test di `tests/`
4. Jalankan `npx vitest run` — semua test harus passing
5. Update `SUMMARY.md`

## Melaporkan Bug

Buka [GitHub Issues](https://github.com/adityasuperdev/speexjs/issues) dengan:

- Deskripsi jelas dan langkah reproduksi
- Versi speexjs-core dan environment (Node.js version, OS)
- Kode minimal yang mereproduksi masalah

## Mengajukan Fitur

Buka GitHub Issue dengan label `enhancement`. Jelaskan:

- Masalah yang ingin diselesaikan
- Contoh penggunaan (API yang diinginkan)
- Alternatif yang sudah dipertimbangkan

## Pull Request

1. Branch dari `master`
2. Pastikan `npx tsup && npx vitest run` lolos
3. Ikuti [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(core): tambah deepMerge function
fix(math): perbaiki floating point rounding
docs: update README
```

4. Buka PR ke `master` dengan deskripsi jelas

## License

Dengan berkontribusi, Anda menyetujui bahwa kontribusi dilisensikan di bawah [MIT License](LICENSE).
