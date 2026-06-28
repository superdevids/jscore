export {
  deepClone,
  deepMerge,
  deepEqual,
  pipe,
  compose,
  debounce,
  throttle,
  memoize,
  retry,
  noop,
  identity,
  once,
} from './core/index.js'

export type {
  DebounceOptions,
  DebouncedFunction,
  MemoizedFunction,
  RetryOptions,
} from './core/index.js'

export {
  add,
  sub,
  mul,
  div,
  round,
  floor,
  ceil,
  approxEqual,
  clamp,
  sum,
  average,
  randomInt,
  inRange,
  median,
  stddev,
  sampleStddev,
  percentile,
  correlation,
  formatCurrency,
  isEven,
  isOdd,
  gcd,
  lcm,
  factorial,
  isPrime,
  toRadians,
  toDegrees,
  lerp,
  percentageOf,
  mapRange,
  mode,
  range,
  weightedAverage,
  geometricMean,
  combinations,
  permutations,
  DivisionByZeroError,
} from './math/index.js'

export {
  formatDate,
  parseDate,
  dateDiff,
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWeekend,
  isLeapYear,
  isBefore,
  isAfter,
  isBetween,
  isBusinessDay,
  addBusinessDays,
  calculateAge,
  timeAgo,
  timeRemaining,
  formatDuration,
  TIMEZONE_WIB,
  TIMEZONE_WITA,
  TIMEZONE_WIT,
  toTimezone,
  formatInTimezone,
  isToday,
  isYesterday,
  isTomorrow,
  isPast,
  isFuture,
  isSameDay,
  daysInMonth,
  dayOfYear,
  weekOfYear,
  quarter,
  maxDate,
  minDate,
  nextMonday,
  nextTuesday,
  nextWednesday,
  nextThursday,
  nextFriday,
  nextSaturday,
  nextSunday,
  lastMonday,
  lastTuesday,
  lastWednesday,
  lastThursday,
  lastFriday,
  lastSaturday,
  lastSunday,
  parseDuration,
  isHolidayIndonesia,
  getIndonesianHolidayNames,
  InvalidDateError,
} from './date/index.js'

export type { DateDiff, Duration } from './date/index.js'

export {
  hash,
  simpleHash,
  randomHex,
  base64Encode,
  base64Decode,
  generateToken,
  generateOTP,
  xorCipher,
  checksum,
  constantTimeEqual,
} from './crypto/index.js'

export {
  join,
  resolve,
  basename,
  dirname,
  extname,
  normalize,
  isAbsolute,
  relative,
  parse,
  format,
} from './path/index.js'

export type { ParsedPath } from './path/index.js'

export {
  groupBy,
  keyBy,
  omit,
  pick,
  pluck,
  shuffle,
  sample,
  sampleSize,
  chunk,
  sortBy,
  orderBy,
  uniqueBy,
  flatten,
  uniq,
  first,
  last,
  isEmpty,
  topoSort,
  slidingWindows,
  tumblingWindows,
  deepGet,
  deepSet,
  partition,
  compact,
  difference,
  intersection,
  union,
  zip,
  unzip,
  countBy,
  maxBy,
  minBy,
  sumBy,
  findIndex,
  findLast,
  drop,
  dropRight,
  take,
  takeRight,
  without,
  nth,
} from './collection/index.js'

export type { SortDirection } from './collection/index.js'

export {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  truncate,
  template,
  uuid,
  nanoid,
  escapeHtml,
  unescapeHtml,
  trim,
  trimStart,
  trimEnd,
  pad,
  padStart,
  padEnd,
  reverse,
  words,
  slugify,
  countOccurrences,
  levenshtein,
  fuzzyMatch,
  maskString,
  terbilang,
  formatRupiah,
  formatBytes,
  randomString,
  randomBoolean,
  pluralize,
  stripHtml,
  truncateWords,
  isPalindrome,
  isAnagram,
  similarity,
  dedent,
  wordCount,
  swapCase,
  toCobolCase,
  charCount,
} from './string/index.js'

export {
  sleep,
  timeout,
  raceWithTimeout,
  allSettledMap,
  parallelMap,
  retryAsync,
  pipeline,
  deferred,
  Queue,
  Semaphore,
  memoizeAsync,
  RateLimiter,
  Mutex,
  batch,
  waterfall,
} from './async/index.js'

export type { Deferred, QueueOptions, MemoizeAsyncOptions } from './async/index.js'

export {
  parseCsv,
  stringifyCsv,
  safeJsonParse,
  env,
  envInt,
  envBool,
} from './io/index.js'

export type { CsvOptions } from './io/index.js'

export {
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isDate,
  isRegExp,
  isMap,
  isSet,
  isPromise,
  isNull,
  isUndefined,
  isNil,
  assertDefined,
  assertType,
  ensureArray,
  castArray,
  getType,
} from './type/index.js'

// ─── dep-exray (dependency scanner) ───────────────────────────
export {
  scanProject,
  generateReport,
  analyzeUsage,
  KNOWN_MAPPINGS,
  KNOWN_CVES,
} from './dep-exray/index.js'

export type {
  ScanResult,
  ReplacementSuggestion,
  SecurityIssue,
  DependencyInfo,
  ScannerConfig,
} from './dep-exray/index.js'

// ─── validation (Indonesia-specific) ────────────────────
export {
  isNIK,
  isNPWP,
  isPhone,
  isEmail,
  isURL,
  parseNIK,
  isPlatNomor,
  isKodepos,
  isNoRekening,
  isNoSIM,
  isPassport,
  isNoBPJS,
  isNoKK,
} from './validation/index.js'

export type { NIKInfo } from './validation/index.js'

// ─── error (typed errors) ───────────────────────────────
export {
  createError,
  isTypedError,
  TypedError,
  MultiError,
  collectErrors,
} from './error/index.js'

export type { ErrorCode } from './error/index.js'

// ─── logger (structured logging) ────────────────────────
export {
  Logger,
  logger,
  consoleTransport,
} from './logger/index.js'

export type {
  LogLevel,
  Transport,
} from './logger/index.js'

export {
  createConsoleTransport,
  createJsonTransport,
  createFileTransport,
  createBufferedTransport,
} from './logger/transports.js'

// ─── color (utilities) ──────────────────────────────────
export {
  hexToRgb,
  rgbToHex,
  lighten,
  darken,
  contrastRatio,
  meetsWCAG,
  isValidHex,
  hexToHsl,
  hslToHex,
  mix,
  randomColor,
  isLight,
  isDark,
  complementary,
  alpha,
} from './color/index.js'
