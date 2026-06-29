const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0, errors = [];

function check(name, fn) {
  try { const r = fn(); if (r) passed++; else { failed++; errors.push('FAIL: '+name); } }
  catch(e) { failed++; errors.push('FAIL: '+name+' - '+e.message.substring(0,100)); }
}

console.log('=== FASE 6: ENVIRONMENT COMPATIBILITY ===');

// ESM import works
check('Node.js ESM import', () => {
  try { require('./dist/index.js'); return true; } catch(e) { return false; }
});

// Check engines field
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
check('package.json engines', () => pkg.engines.node === '>=18.0.0');
check('package.json type: module', () => pkg.type === 'module');
check('package.json sideEffects: false', () => pkg.sideEffects === false);

// Check exports exist
const exportPaths = Object.keys(pkg.exports || {});
check('Has ./ml export', () => exportPaths.includes('./ml'));
check('Has ./stats export', () => exportPaths.includes('./stats'));
check('Has ./nlarray export', () => exportPaths.includes('./nlarray'));

console.log('\n=== FASE 7: API CONTRACT ===');

const s = require('./dist/index.js');

// Verify documented API exists
const expectedAPIs = [
  'deepClone', 'deepMerge', 'deepEqual', 'pipe', 'compose', 'debounce', 'throttle', 'memoize', 'noop', 'identity', 'once',
  'add', 'sub', 'mul', 'div', 'round', 'median', 'stddev', 'correlation', 'factorial',
  'formatDate', 'parseDate', 'timeAgo', 'addDays', 'isBusinessDay',
  'camelCase', 'kebabCase', 'slugify', 'uuid', 'nanoid', 'levenshtein', 'escapeHtml',
  'isEmail', 'isPhone', 'isURL', 'isIP', 'isUUID', 'isCreditCard', 'isStrongPassword',
  'StandardScaler', 'MinMaxScaler', 'LinearRegression', 'KMeans', 'trainTestSplit',
  'normalPDF', 'normalCDF', 'ttestInd', 'skewness', 'kurtosis',
  'histogram', 'kde', 'boxPlotData', 'ecdf', 'colorMap',
  'Queue', 'Semaphore', 'RateLimiter', 'Mutex', 'retryAsync', 'debounceAsync',
  'NDArray',
  'curry', 'pipe', 'ifElse', 'when', 'unless', 'tryCatch', 'attempt', 'flow',
  'TypedError', 'MultiError', 'createError', 'collectErrors',
  'hexToRgb', 'lighten', 'contrastRatio', 'meetsWCAG',
  'Logger', 'consoleTransport',
  'parseCsv', 'safeJsonParse', 'env',
  'isString', 'isNumber', 'isNil', 'isPlainObject', 'isTypedArray', 'getType',
];

let apiOk = 0, apiFail = 0;
for (const api of expectedAPIs) {
  if (s[api] !== undefined) apiOk++;
  else { apiFail++; errors.push('MISSING API: '+api); }
}
check('All documented APIs exist', () => apiFail === 0);
console.log('  APIs found:', apiOk, '| Missing:', apiFail);

// Verify documentation matches behavior
check('pipe([1,2,3], double) works', () => s.pipe(5, x => x+1, x => x*2) === 12);
check('compose(double, add1) works', () => s.compose(x => x+1, x => x*2)(5) === 11);
check('ifElse works', () => s.ifElse(x => x>10, x => x*2, x => x/2)(20) === 40);
check('when works', () => s.when(x => x>10, x => x*2)(5) === 5);

console.log('\n=== FASE 8: SECURITY AUDIT ===');

// Check for hardcoded secrets
const srcFiles = fs.readdirSync('./src', {recursive: true}).filter(f => f.endsWith('.ts'));
let secretFound = false;
const secretPatterns = [/password\s*=\s*['"][^'"]+['"]/i, /secret\s*=\s*['"][^'"]+['"]/i, /api[_-]?key\s*=\s*['"][^'"]+['"]/i];
for (const f of srcFiles) {
  try {
    const content = fs.readFileSync(path.join('./src', f), 'utf-8');
    for (const pat of secretPatterns) {
      if (pat.test(content)) { console.log('  POTENTIAL SECRET:', f); secretFound = true; }
    }
  } catch(e) {}
}
check('No hardcoded secrets', () => !secretFound);

// Check npm audit
console.log('\n=== FASE 9: DISTRIBUTION QUALITY ===');

// Check tarball files
const filesField = pkg.files;
check('Has files field', () => Array.isArray(filesField));
check('dist in files', () => filesField.includes('dist'));
check('*.md in files', () => filesField.includes('*.md'));

// Check bin entry
check('Has dep-exray bin', () => pkg.bin && pkg.bin['dep-exray'] === 'dist/dep-exray/cli.js');

// Check main entry
check('main points to dist/index.js', () => pkg.main === './dist/index.js');
check('types points to dist/index.d.ts', () => pkg.types === './dist/index.d.ts');

// Verify dist files exist
const distFiles = ['dist/index.js', 'dist/index.d.ts', 'dist/ml/index.js', 'dist/stats/index.js', 'dist/viz-data/index.js'];
for (const f of distFiles) {
  check('Dist file exists: '+f, () => fs.existsSync(f));
}

// Check package size
const stats = fs.statSync('dist/index.js');
const sizeKB = stats.size / 1024;
console.log('  dist/index.js size:', sizeKB.toFixed(1), 'KB');
check('dist/index.js < 300 KB', () => sizeKB < 300);

console.log('\n=== FASE 10: REGRESSION ===');
// Run existing tests via npm
check('npm test passes', () => {
  const { execSync } = require('child_process');
  try { execSync('npm test 2>&1', {stdio: 'pipe', timeout: 120000, cwd: __dirname}); return true; }
  catch(e) { return false; }
});

// ===== SUMMARY =====
console.log(`\n=== FASE 6-10 RESULTS ===`);
console.log('Passed:', passed, '| Failed:', failed);
if (failed > 0) { console.log('\nFailures:'); errors.forEach(e => console.log('  '+e)); }
console.log('\nAll distribution quality checks:', apiOk + '/' + expectedAPIs.length + ' APIs verified');
process.exit(failed > 0 ? 1 : 0);
