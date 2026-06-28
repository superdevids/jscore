# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in superjs-core, please report it by emailing adityasuperdev@gmail.com.

Do NOT create a public GitHub issue for security vulnerabilities.

You should receive a response within 48 hours. If not, follow up via email.

## What to Include

- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Potential impact
- Suggested fix (if any)

## Scope

- superjs-core npm package
- dep-exray CLI tool
- GitHub Actions workflows

## Out of Scope

- The `xorCipher` function in crypto module is explicitly **NOT** intended for security purposes. It is a simple XOR obfuscation utility for light data masking only. Do not use it for encryption of sensitive data.

## Disclosure Policy

Once a vulnerability is confirmed:
1. We will work on a fix
2. A security advisory will be published on GitHub
3. A patched version will be released to npm
4. Credit will be given to the reporter (if desired)
