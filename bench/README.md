# Bench: Node vs Go hybrid

Same box, same upstreams, same paths. No k6 dep.

## Run

Two terminals:

```bash
# 1 — Node
npm run dev -- --port 3000
# 2 — Go (from repo root)
go run ./go-api
# 3 — bench
node bench/bench.mjs
# custom
CONCURRENCY=20 REQUESTS=100 node bench/bench.mjs
NODE_URL=http://localhost:3000 GO_URL=http://localhost:8080 node bench/bench.mjs
```

Docker self-host sanity (both services, Node rewrites to Go when `GO_API_URL` set):

```bash
docker compose up --build
NODE_URL=http://localhost:3000 GO_URL=http://localhost:3000 node bench/bench.mjs
# then bench go direct
GO_URL=http://localhost:8080 node bench/bench.mjs
```

## Cases

`/api/dns`, `/api/headers`, `/api/tcp` (443/80), `/api/ping`. Expect Go p50 10-20% lower, p95 tighter, similar rps on single box; `ping`/`traceroute` parity (binary-bound).
