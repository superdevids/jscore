# Security Policy

## Melaporkan Kerentanan

Kami serius terhadap keamanan SpeexJS. Jika menemukan kerentanan:

**JANGAN** laporkan via GitHub Issues publik.

Lapor ke email: **keamanan@speexjs.org** dengan subjek `[SECURITY]` + deskripsi singkat.

Sertakan:
- Deskripsi kerentanan
- Langkah reproduksi
- Versi terpengaruh
- Dampak potensial
- Saran perbaikan (opsional)

Kami akan merespon dalam **48 jam** untuk konfirmasi.

## Versi Didukung

| Versi | Dukungan |
|-------|----------|
| 0.2.x | ✅ Active |
| 0.1.x | ⚠️ Limited |
| < 0.1 | ❌ Tidak didukung |

## Responsible Disclosure

1. Laporkan dulu — jangan publikasikan sebelum ada fix
2. Beri waktu 30-90 hari tergantung kompleksitas
3. Kami akan mencantumkan kredit Anda di release notes (jika diizinkan)

## Cakupan Keamanan

- **Server:** CSRF, Helmet, session security, rate limiting
- **Auth:** scrypt/PBKDF2, token management
- **Schema:** Input validation cegah injection
- **Crypto:** AES-256-GCM, constant-time comparison
- **Database:** Parameterized queries cegah SQL injection
- **Storage:** Path traversal prevention
- **Dependencies:** Zero runtime = minimal attack surface
