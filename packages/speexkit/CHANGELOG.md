# Changelog

## v0.8.4 (2026-06-29)
- Updated README for cleaner npm display
- Fixed encoding issues in markdown files

## v0.8.2 (2026-06-29)
- ML module: StandardScaler, LinearRegression, KMeans, KNN, PCA
- Stats module: normalPDF, ttestInd, skewness, pearsonCorrelation
- Viz-data module: histogram, kde, boxPlotData, ecdf, colorMap
- 1,477 tests across 24 test files
- Renamed package from speexjs-core to speexkit
- Removed Indonesia-specific validators and localization

## v0.7.0 (2026-06-28)
- Color, error, logger modules
- deepEqual, pipe, compose
- Queue, Semaphore, RateLimiter, Mutex, batch, waterfall
- Math: median, stddev, percentile, correlation, formatCurrency
- Date: timeAgo, timeRemaining, Duration, formatDuration, timezone
- Validation: isPhone, isEmail, isURL
- Collection: deepGet, deepSet, topoSort, slidingWindows
- dep-exray: dependency scanner + CLI
- 828 tests across 19 test files

### Fixed
- Floating-point rounding, leap year detection
- Prototype pollution, ReDoS edge cases
