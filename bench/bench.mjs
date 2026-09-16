#!/usr/bin/env node
// Bench Node (/api on :3000 or :3100) vs Go (/api on :8080).
// No k6/wrk dep — std fetch + concurrency. Run: node bench/bench.mjs
// Env: NODE_URL=http://localhost:3000  GO_URL=http://localhost:8080

const NODE_URL = (process.env.NODE_URL || "http://localhost:3000").replace(/\/$/, "");
const GO_URL = (process.env.GO_URL || "http://localhost:8080").replace(/\/$/, "");

const cases = [
  { name: "dns A", path: "/api/dns?name=example.com&type=A" },
  { name: "dns MX", path: "/api/dns?name=google.com&type=MX" },
  { name: "headers", path: "/api/headers?url=https://example.com" },
  { name: "tcp 443", path: "/api/tcp?host=example.com&port=443" },
  { name: "tcp 80", path: "/api/tcp?host=example.com&port=80" },
  { name: "ping", path: "/api/ping?host=example.com" },
];

const CONCURRENCY = parseInt(process.env.CONCURRENCY || "10", 10);
const REQUESTS = parseInt(process.env.REQUESTS || "40", 10);
const WARMUP = parseInt(process.env.WARMUP || "4", 10);

function pct(sorted, p) {
  const i = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(i, sorted.length - 1))];
}
function stats(durations) {
  if (!durations.length) return { count: 0 };
  const s = [...durations].sort((a, b) => a - b);
  const sum = s.reduce((a, b) => a + b, 0);
  return {
    count: s.length,
    min: Math.min(...s).toFixed(1),
    p50: pct(s, 50).toFixed(1),
    p95: pct(s, 95).toFixed(1),
    p99: pct(s, 99).toFixed(1),
    max: Math.max(...s).toFixed(1),
    mean: (sum / s.length).toFixed(1),
  };
}
async function fetchOne(url) {
  const t0 = performance.now();
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
    await r.text(); // drain
    const ms = performance.now() - t0;
    return { ms, ok: r.ok, status: r.status };
  } catch (e) {
    const ms = performance.now() - t0;
    return { ms, ok: false, error: String(e).slice(0, 80) };
  }
}
async function runCase(label, base, path) {
  const url = base + path;
  // warmup
  for (let i = 0; i < WARMUP; i++) await fetchOne(url);
  const durations = [];
  let ok = 0, fail = 0;
  const start = performance.now();
  // batched concurrency
  for (let i = 0; i < REQUESTS; i += CONCURRENCY) {
    const batch = Math.min(CONCURRENCY, REQUESTS - i);
    const res = await Promise.all(Array.from({ length: batch }, () => fetchOne(url)));
    for (const r of res) {
      durations.push(r.ms);
      if (r.ok) ok++; else fail++;
    }
  }
  const wall = performance.now() - start;
  const rps = (REQUESTS / (wall / 1000)).toFixed(1);
  return { label, url, ok, fail, rps, durations, s: stats(durations) };
}
function probe(base, urlPath) {
  return base + urlPath;
}
async function checkUp() {
  for (const [name, base] of [["node", NODE_URL], ["go", GO_URL]]) {
    try {
      const r = await fetch(base + "/api/dns?name=example.com&type=A", { signal: AbortSignal.timeout(5000) });
      if (!r.ok) console.warn(`warn: ${name} ${base} not ok: ${r.status}`);
    } catch (e) {
      console.warn(`warn: ${name} ${base} unreachable: ${e.message?.slice(0,60) || e}. Start services first.`);
    }
  }
}

console.log(`bench: CONCURRENCY=${CONCURRENCY} REQUESTS=${REQUESTS} WARMUP=${WARMUP}`);
console.log(`node=${NODE_URL}  go=${GO_URL}`);
console.log("");

await checkUp();

console.log(`| case    | target | ok | fail |  rps |   min |   p50 |   p95 |   p99 |   max |  mean |`);
console.log(`|---------|--------|----|------|------|-------|-------|-------|-------|-------|-------|`);
const rows = [];
for (const c of cases) {
  for (const [target, base] of [["node", NODE_URL], ["go", GO_URL]]) {
    const r = await runCase(c.name, base, c.path);
    const line = `| ${c.name.padEnd(7)} | ${target.padEnd(6)} | ${String(r.ok).padStart(2)} | ${String(r.fail).padStart(4)} | ${String(r.rps).padStart(4)} | ${String(r.s.min).padStart(5)} | ${String(r.s.p50).padStart(5)} | ${String(r.s.p95).padStart(5)} | ${String(r.s.p99).padStart(5)} | ${String(r.s.max).padStart(5)} | ${String(r.s.mean).padStart(5)} |`;
    console.log(line);
    rows.push({ case: c.name, target, ...r });
  }
}
console.log("");
console.log("Compare p50/p95 node vs go per case. Lower ms wins. rps higher wins.");
console.log("Tip: rerun with REQUESTS=100 CONCURRENCY=20 for tail.");
