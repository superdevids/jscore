# Security — SpeexJS Core

## Reporting Vulnerabilities

If you discover a security vulnerability, **do not open a public GitHub issue**. Please report it privately via email:

**adityasuperdev@gmail.com**

We aim to respond within 48 hours. If you don't hear back, please follow up.

### Report Template

- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Potential impact
- Suggested fix (optional)

## Supported Versions

| Version | Support |
|---------|---------|
| 0.7.x   | ✅ Security patches |
| 0.6.x   | ✅ Critical fixes only |
| < 0.6   | ❌ Not supported |

## Responsible Disclosure Process

1. Vulnerability confirmed → team works on a fix
2. Security advisory published on GitHub
3. Patched version released to npm
4. Reporter credited (if desired)

## Scope Notes

- **NDArray** (`nlarray`, `nlfunction`) and **functional modules** follow standard numeric computing practices. They process data as provided and do not introduce security boundaries.
- **Crypto module** provides basic utility functions (XOR obfuscation, hashing helpers) intended for light data masking — **not** for encryption of sensitive data. Use dedicated libraries for production security.
- **Dep-exray** reads `package.json` / `node_modules` metadata from the local file system. It does not execute arbitrary code or make network requests beyond npm registry lookups.
