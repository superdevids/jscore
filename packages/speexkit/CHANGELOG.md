# Changelog

## v1.4.10 (2026-06-29)
- Fixed: camelCase(null) crash — added null guard in splitWords
- Fixed: isEmail(null) crash — added typeof guard
- Fixed: isCreditCard double-escaped regex (was matching backslash, not digits)
- Fixed: isPort double-escaped regex
- Fixed: isEmpty(null) returning false — missing null check in collection module
- All brutal test phases passed (10 phases, 0 failures)

## v1.4.9 (2026-06-29)
- Added barrel exports for ml, stats, viz-data modules
- Formatted minified source files to multi-line
- Fixed dep-exray known-mappings to reference speexkit

## v1.4.7 (2026-06-29)
- ML module: StandardScaler, LinearRegression, KMeans, trainTestSplit, metrics
- Stats module: gammaLn, erf, normalPDF, ttestInd, skewness, kurtosis
- Viz-data module: histogram, kde, boxPlotData, ecdf, colorMap
- 1,477 tests across 24 test files

## v0.8.x (2026-06-28)
- Initial release as speexkit (rebranded from speexjs-core)
- NDArray, functional tools, validation, async, collection, color, crypto, etc.
- Zero dependencies
