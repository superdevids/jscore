# Keamanan — SpeexJS Core

## Melaporkan Kerentanan

Jika Anda menemukan celah keamanan, **jangan buka GitHub Issue publik**. Laporkan melalui email:

**adityasuperdev@gmail.com**

Respon dalam 48 jam. Jika belum ada kabar, silakan follow-up.

### Format Laporan

- Deskripsi kerentanan
- Langkah reproduksi
- Versi yang terpengaruh
- Dampak potensial
- Saran perbaikan (opsional)

## Supported Versions

| Versi | Dukungan |
|-------|----------|
| 0.x | ✅ Patch untuk kerentanan kritis |
| < 0.1 | ❌ Tidak didukung |

## Responsible Disclosure

1. Kerentanan dikonfirmasi → tim bekerja pada fix
2. Security advisory dipublikasikan di GitHub
3. Versi patched dirilis ke npm
4. Kredit diberikan kepada pelapor (jika diizinkan)

## Catatan

Fungsi `xorCipher` di module crypto **bukan untuk keamanan**. Ini hanya XOR obfuscation sederhana untuk masking data ringan. Jangan digunakan untuk enkripsi data sensitif.
