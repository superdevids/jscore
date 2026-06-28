# Changelog

## [0.3.1] - 2026-06-28

### Fixed
- Cross-platform `clean` script (was `rm -rf`, now `node -e fs.rmSync`)
- GitHub Actions: dep-exray-scan now installs `superjs-core` (was deleted `superjs-dep-exray`)
- GitHub Actions: CI workflow now runs lint + type-check + test on every push/PR
- Removed misleading "zero-dependency" keyword (now has commander + picocolors deps)
- Updated size-limit to actual bundle size (60KB)

### Added
- Biome linter + formatter config
- Vitest coverage with 80% threshold
- CI workflow with matrix testing (Node 18, 20, 22)
- SECURITY.md for vulnerability disclosure

## [0.3.0] - 2026-06-27

### Changed
- Merged `superjs-dep-exray` into `superjs-core` as a built-in module
- Single package: `npm install superjs-core` gets everything
- 7 deprecated npm packages removed/unpublished

### Added
- `dep-exray` module: scanProject, analyzeUsage, generateReport, KNOWN_MAPPINGS, KNOWN_CVES
- CLI: `npx dep-exray .`

## [0.2.0] - 2026-06-27

### Added
- crypto module: hash, randomHex, base64, generateToken, generateOTP
- path module: join, resolve, basename, dirname, extname

## [0.1.0] - 2026-06-27

### Added
- Initial release
- core, math, date, collection, string, async, io, type modules
- 100+ utility functions
- Full TypeScript strict mode
