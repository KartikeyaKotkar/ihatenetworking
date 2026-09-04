# "Did You Ping It" — Implementation Plan (living doc)

Last updated: 2026-09-04. Scope of this update: **Phase 1 MVP, Subnetting (12/12) + IP Tools (9/9) shipped. 21 tools live.**

## Status

- [x] Framework: Next.js 16.3.3 App Router + TypeScript + Tailwind 4, `src/` layout. Dark muted theme, glass panels.
- [x] Core lib IPv4: `src/lib/ipv4.ts` — integer-safe subnet math + IP-tools helpers (validation with reasons, binary converters, scope classifier, range describe/generate).
- [x] Core lib IPv6: `src/lib/ipv6.ts` — BigInt-based parse/expand/compress (RFC 5952) + subnet calc + CIDR parse. tsconfig target bumped ES2017 → ES2020 for BigInt literals (also cleared stale `tsconfig.tsbuildinfo` once).
- [x] Shared UI: `src/components/ToolShell.tsx` + `src/components/tool-ui.tsx` (`CopyButton`, `ResultRow`, `ErrorBox`, input classes).
- [x] 12 subnetting routes live, all static, client-side, unique metadata + FAQ + related links.
- [x] 9 IP-tools routes live, same pattern (pages built via parallel subagents, verified by read-back + tsc + build).
- [x] Homepage lists Subnetting (12) + IP Tools (9). Sitemap covers `/` + 21 tools.
- [x] Tests: `tests/subnet.test.ts` (12) + `tests/iptools.test.ts` (10) + sample. `npm test` green (23 pass).
- [x] Typecheck + `next build` green (26 static pages incl. `/`, `/_not-found`, `/sitemap.xml`).
- [ ] NOT started: DNS/lookups (#22-30), utilities (#31-35), converters (#36-41). See `extra/didyoupingit.md` §2.

## Routes (Phase 1 Subnetting)

| # | Tool | Route |
|---|------|-------|
| 1 | IPv4 Subnet Calculator | `/subnet-calculator` |
| 2 | CIDR Calculator | `/cidr-calculator` |
| 3 | VLSM Calculator | `/vlsm-calculator` |
| 4 | Subnet Splitter | `/subnet-splitter` |
| 5 | Subnet Range Calculator | `/subnet-range-calculator` |
| 6 | Usable Host Calculator | `/usable-host-calculator` |
| 7 | Subnet Mask Calculator | `/subnet-mask-calculator` |
| 8 | Wildcard Mask Calculator | `/wildcard-mask-calculator` |
| 9 | CIDR to Subnet Mask | `/cidr-to-subnet-mask` |
| 10 | Subnet Mask to CIDR | `/subnet-mask-to-cidr` |
| 11 | Network Address Calculator | `/network-address-calculator` |
| 12 | Broadcast Address Calculator | `/broadcast-address-calculator` |

Homepage (`/`) lists all 21. Sitemap at `src/app/sitemap.ts` covers `/` + 21 tools (base `https://didyoupingit.com` — change before launch).

## Routes (Phase 1 IP Tools)

| # | Tool | Route |
|---|------|-------|
| 13 | IPv4 Address Validator | `/ipv4-validator` |
| 14 | IPv4 to Binary | `/ipv4-to-binary` |
| 15 | Binary to IPv4 | `/binary-to-ipv4` |
| 16 | IP Range Calculator | `/ip-range-calculator` |
| 17 | IP Range Generator | `/ip-range-generator` |
| 18 | Private IP Checker | `/private-ip-checker` |
| 19 | IPv6 Subnet Calculator | `/ipv6-subnet-calculator` |
| 20 | IPv6 Address Validator | `/ipv6-validator` |
| 21 | IPv6 Compression & Expansion | `/ipv6-compression` |

## Core lib API (`src/lib/ipv4.ts`)

- `parseIPv4(s) → uint32 | null` — strict 4-octet decimal.
- `ipv4ToString(n)`, `ipv4ToBinaryGrouped(n)`, `isValidIPv4(s)`
- `parsePrefix(x) → 0-32 | null` (accepts `/24` or `24`)
- `prefixToMaskInt/String`, `prefixToWildcardString`, `maskIntToPrefix`, `maskStringToPrefix`, `isValidMask`
- `networkAddressInt`, `broadcastAddressInt`, `totalAddresses`, `usableHostCount` (/31→2 per RFC 3021, /32→1)
- `firstUsableInt`, `lastUsableInt`, `describeSubnet(ip, prefix) → SubnetInfo`, `ipClassOf`
- `parseCIDR("10.0.0.5/16")`, `splitSubnet(net, p, newP)` (null if `newP < p` or >1024 blocks), `prefixForHosts(n)`, `vlsmAllocate(base, p, hosts[])` (largest-first, boundary-aligned, null on overflow)

Conventions: addresses as unsigned 32-bit ints (`>>> 0`); per-octet AND to dodge signed-bitwise traps; `Math.pow(2, k)` for sizes, never `1 << k` for k≥31.

## IP-tools lib API additions

IPv4 (`src/lib/ipv4.ts`):
- `validateIPv4Detailed(s) → {valid, reason, value}` — first-failure reason per octet.
- `ipv4StringToBinary(s) → dotted binary | null`, `binaryToIPv4String(s)` — accepts dotted or plain 32-bit.
- `scopeOfIPv4(int) → {scope, private, label}` — private (RFC 1918 ×3), loopback, link-local, carrier-grade-nat (100.64/10, NOT private), multicast, broadcast, reserved (0/8, 192.0.0/24, TEST-NET-1/2/3), public.
- `describeIPRange(a, b)` — null if invalid/reversed; `generateIPRange(a, b, limit=256)` — null over limit.

IPv6 (`src/lib/ipv6.ts`, BigInt):
- `parseIPv6(s) → bigint | null` — single `::`, 8-group check, embedded IPv4 tail supported.
- `expandIPv6(b)` full lowercase, `compressIPv6(b)` RFC 5952 (longest run ≥2, first on tie, no single-group shrink).
- `describeIPv6Subnet(ip, p)` — network, last, total `2^(128-p)` as bigint; `parseIPv6CIDR`, `parseIPv6Prefix`, `isValidIPv6`.

## Page pattern (follow for future tools)

- `src/app/<route>/page.tsx` — Server Component, static `metadata` (unique title+description), renders `<ToolShell>` + `<Calculator/>`.
- `src/app/<route>/calculator.tsx` — `'use client'`, `useState` inputs + `useMemo` result, `ErrorBox` on invalid, `CopyButton` + Reset, results via `ResultRow`/table. No server calls.
- `ToolShell` props: `title, description, children, example, explanation, faqs[{q,a}], related[{href,label}]`.

## Verification

1. `npm test` — 23/23 pass (12 subnet + 10 iptools + 1 sample).
2. `npx tsc --noEmit` — clean (after ES2020 bump; stale tsbuildinfo deleted once).
3. `npx next build` — clean, 26 static routes.
4. Manual spot checks: `192.168.1.10/24` full info; `/24→/26` split = 4 blocks; VLSM `[100,50,10]` in `/24` → `/25,/26,/28`; `255.0.255.0` rejected as non-contiguous; `2001:db8::1/64` → network `2001:db8::`, last `2001:db8::ffff:ffff:ffff:ffff`; `::ffff:192.0.2.1` valid; single-zero-group `2001:db8:0:1:1:1:1:1` not shrunk.

## Known limits / next fixes

- `splitSubnet` caps at 1024 rows (UI safety); copy shows full list only up to cap.
- `vlsmAllocate` caps at 64 requirements.
- No URL-state persistence yet (UX rule says preserve useful state — add `useSearchParams`-backed defaults later).
- Sitemap base URL placeholder; set real domain + Search Console at launch.
- `src/tools/` dir from old plan unused — calculators live colocated in `src/app/<route>/calculator.tsx` per App Router colocation. Either adopt this doc or move files.

## Original init notes (superseded, kept for history)

- `create-next-app` scaffold done earlier with TS + Tailwind + App Router + ESLint + `src/`.
- Vitest + jsdom installed; config in `vitest.config.ts` with `@` alias; scripts: `test`, `typecheck`.
- Design: dark-first (`--background #050505`), neon accents used sparingly, `.glass-panel` utility in `globals.css`.
