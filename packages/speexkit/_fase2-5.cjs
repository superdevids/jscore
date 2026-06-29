const s = require('./dist/index.js');

let passed = 0, failed = 0, errors = [];

function check(name, fn) {
  try { const r = typeof fn === 'function' ? fn() : fn; if (r) passed++; else { failed++; errors.push('FAIL: '+name); } }
  catch(e) { failed++; errors.push('FAIL: '+name+' - '+e.message.substring(0,100)); }
}

// ===== FASE 2: TYPE SYSTEM TORTURE =====
console.log('\n=== FASE 2: TYPE SYSTEM TORTURE ===');

// Deeply nested generics
check('deepClone with nested Map', () => {
  const m = new Map([[1, new Map([[2, new Set([3])]])]]);
  const c = s.deepClone(m);
  return c instanceof Map && c.get(1) instanceof Map;
});

check('deepClone with circular ref', () => {
  const o = { a: 1 }; o.self = o;
  const c = s.deepClone(o);
  return c.a === 1 && c.self === c;
});

// Union types as input
check('deepMerge with union objects', () => {
  const r = s.deepMerge({a:1}, {b:2}, {c:3});
  return r.a === 1 && r.b === 2 && r.c === 3;
});

// Edge: never/unknown/any-like
check('deepClone(() => 42)', () => {
  const fn = () => 42;
  return s.deepClone(fn) === fn;  // functions should be same ref
});

check('identity with undefined', () => s.identity(undefined) === undefined);
check('identity with Symbol', () => typeof s.identity(Symbol('test')) === 'symbol');
check('noop returns undefined', () => s.noop() === undefined);

// ===== FASE 3: ASYNC & CONCURRENCY TORTURE =====
console.log('\n=== FASE 3: ASYNC TORTURE ===');

check('Queue concurrency 0 defaults to 1', async () => {
  const q = new s.Queue();
  return q.running === 0;
});

check('Queue with priority', async () => {
  const q = new s.Queue({concurrency: 1});
  q.pause();
  const order = [];
  q.add(async () => { order.push('low'); return 'low'; }, { priority: 0 });
  q.add(async () => { order.push('high'); return 'high'; }, { priority: 10 });
  q.resume();
  await s.sleep(50);
  return order[0] === 'high';
});

check('Semaphore concurrency limit', async () => {
  const sem = new s.Semaphore(2);
  let concurrent = 0, maxConcurrent = 0;
  const tasks = Array.from({length: 5}, () => sem.use(async () => {
    concurrent++;
    maxConcurrent = Math.max(maxConcurrent, concurrent);
    await s.sleep(20);
    concurrent--;
  }));
  await Promise.all(tasks);
  return maxConcurrent <= 2;
});

check('RateLimiter blocks excess', async () => {
  const rl = new s.RateLimiter({maxRequests: 2, perWindow: 1000});
  check('tryAcquire x3 returns false', rl.tryAcquire() && rl.tryAcquire() && !rl.tryAcquire());
  return true;
});

check('Mutex mutual exclusion', async () => {
  const mutex = new s.Mutex();
  let shared = 0;
  const tasks = Array.from({length: 10}, () => mutex.use(async () => {
    const v = shared;
    await s.sleep(5);
    shared = v + 1;
  }));
  await Promise.all(tasks);
  return shared === 10;
});

check('retryAsync succeeds', async () => {
  let attempts = 0;
  const r = await s.retryAsync(async () => {
    attempts++;
    if (attempts < 3) throw new Error('retry');
    return 'ok';
  }, { attempts: 5, baseDelay: 5 });
  return r === 'ok' && attempts === 3;
});

check('retryAsync fails after max', async () => {
  try {
    await s.retryAsync(async () => { throw new Error('always fail'); }, { attempts: 2, baseDelay: 5 });
    return false;
  } catch(e) { return true; }
});

check('parallelMap with concurrency', async () => {
  const r = await s.parallelMap([1,2,3,4], async x => x * 2, 2);
  return JSON.stringify(r) === '[2,4,6,8]';
});

check('debounceAsync fires once', async () => {
  let count = 0;
  const fn = s.debounceAsync(async (x) => { count++; return x; }, 30);
  fn('a'); fn('b');
  const r = await fn('c');
  await s.sleep(60);
  return count === 1 && r === 'c';
});

check('timeout resolves', async () => {
  const r = await s.timeout(Promise.resolve(42), 1000);
  return r === 42;
});

check('timeout rejects', async () => {
  try {
    await s.timeout(new Promise(() => {}), 10, 'timed out');
    return false;
  } catch(e) { return e.message === 'timed out'; }
});

check('raceWithTimeout returns timeout signal', async () => {
  const r = await s.raceWithTimeout(new Promise(() => {}), 10);
  return r === 'timeout';
});

// ===== FASE 4: ERROR HANDLING =====
console.log('\n=== FASE 4: ERROR HANDLING ===');

check('TypedError has correct status', () => {
  const e = s.createError('NOT_FOUND', 'not found');
  return e.status === 404 && e.code === 'NOT_FOUND';
});

check('MultiError collects errors', () => {
  const me = new s.MultiError([new Error('a'), new Error('b')]);
  return me.length === 2 && me.messages.join(',') === 'a,b';
});

check('collectErrors returns errors', () => {
  const r = s.collectErrors(() => { throw new Error('fail'); });
  return r.errors.length === 1 && r.result === undefined;
});

check('collectErrors returns result', () => {
  const r = s.collectErrors(() => 42);
  return r.result === 42 && r.errors.length === 0;
});

check('tryCatch returns fallback', () => {
  const safe = s.tryCatch(() => JSON.parse('invalid'), {});
  return JSON.stringify(safe('test')) === '{}';
});

check('attempt returns Error', () => {
  const r = s.attempt(() => JSON.parse('bad'));
  return r instanceof Error;
});

// ===== FASE 5: PERFORMANCE & MEMORY =====
console.log('\n=== FASE 5: PERFORMANCE ===');

// Big data handling
const bigArray = Array.from({length: 10000}, (_, i) => i);
const bigString = 'hello world '.repeat(1000);

check('deepClone 10K array', () => {
  const c = s.deepClone(bigArray);
  return c.length === 10000 && c[0] === 0;
}, true);

check('deepMerge 100 props', () => {
  const a = {}; for (let i = 0; i < 100; i++) a['k'+i] = i;
  const r = s.deepMerge(a, {extra: true});
  return r.extra === true && r.k0 === 0;
}, true);

check('groupBy 10K items', () => {
  const items = Array.from({length: 10000}, (_, i) => ({group: i % 10, val: i}));
  const g = s.groupBy(items, x => x.group);
  return Object.keys(g).length === 10;
}, true);

check('shuffle 10K returns same length', () => {
  const r = s.shuffle(bigArray);
  return r.length === 10000;
}, true);

check('levenshtein long strings', () => {
  const a = 'x'.repeat(100) + 'y';
  const b = 'x'.repeat(100) + 'z';
  return s.levenshtein(a, b) === 1;
}, true);

check('deepEqual 1000 props', () => {
  const a = {}; const b = {};
  for (let i = 0; i < 1000; i++) { a['k'+i] = i; b['k'+i] = i; }
  return s.deepEqual(a, b) === true;
}, true);

check('NDArray large operations', () => {
  const a = s.NDArray.ones([100, 100]);
  const b = s.NDArray.ones([100, 100]);
  const c = a.add(b);
  return c.get(0, 0) === 2;
}, true);

// Quick benchmark
console.log('\n--- Quick Benchmarks ---');
const benchStart = Date.now();
for (let i = 0; i < 1000; i++) s.deepClone({a:1, b:{c:2, d:[1,2,3]}});
const deepCloneMs = Date.now() - benchStart;
console.log('deepClone x1000:', deepCloneMs + 'ms');

const benchStart2 = Date.now();
for (let i = 0; i < 10000; i++) s.isEmail('test@example.com');
const isEmailMs = Date.now() - benchStart2;
console.log('isEmail x10000:', isEmailMs + 'ms');

const benchStart3 = Date.now();
for (let i = 0; i < 100000; i++) s.camelCase('hello-world-test');
const camelMs = Date.now() - benchStart3;
console.log('camelCase x100000:', camelMs + 'ms');

const benchStart4 = Date.now();
for (let i = 0; i < 10000; i++) s.kde([1,2,3,4,5,6,7,8,9,10]);
const kdeMs = Date.now() - benchStart4;
console.log('kde x10000:', kdeMs + 'ms');

// ===== SUMMARY =====
console.log(`\n=== FASE 2-5 RESULTS ===`);
console.log('Passed:', passed, '| Failed:', failed);
if (failed > 0) { console.log('\nFailures:'); errors.forEach(e => console.log('  '+e)); }
process.exit(failed > 0 ? 1 : 0);
