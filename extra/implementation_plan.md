# "Did You Ping It" — Implementation Plan (living doc)

Last updated: 2026-09-04. Scope of this update: **Phase 1 MVP, Subnetting only (12/12 tools shipped)**.

## Status

- [x] Framework: Next.js 16.3.3 App Router + TypeScript + Tailwind 4, `src/` layout. Dark muted theme, glass panels.
- [x] Core lib: `src/lib/ipv4.ts` — pure integer-safe IPv4/subnet math, no float tricks.
- [x] Shared UI: `src/components/ToolShell.tsx` (title, input/result slot, explanation, example, FAQ, related, JSON-LD) + `src/components/tool-ui.tsx` (`CopyButton`, `ResultRow`, `ErrorBox`, input classes).
- [x] 12 subnetting routes live, all static, all client-side calc, each with unique metadata + FAQ + related links.
- [x] Tests: `tests/subnet.test.ts` (12 tests) + sample. `npm test` green.
- [x] Typecheck + `next build` green (17 static pages incl. `/`, `/_not-found`, `/sitemap.xml`).
- [ ] Next phases (NOT started): IP tools (#13-21), DNS/lookups (#22-30), utilities (#31-35), converters (#36-41). See `extra/didyoupingit.md` §2.

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

Homepage (`/`) lists all 12. Sitemap at `src/app/sitemap.ts` covers `/` + 12 tools (base `https://didyoupingit.com` — change before launch).

## Core lib API (`src/lib/ipv4.ts`)

- `parseIPv4(s) → uint32 | null` — strict 4-octet decimal.
- `ipv4ToString(n)`, `ipv4ToBinaryGrouped(n)`, `isValidIPv4(s)`
- `parsePrefix(x) → 0-32 | null` (accepts `/24` or `24`)
- `prefixToMaskInt/String`, `prefixToWildcardString`, `maskIntToPrefix`, `maskStringToPrefix`, `isValidMask`
- `networkAddressInt`, `broadcastAddressInt`, `totalAddresses`, `usableHostCount` (/31→2 per RFC 3021, /32→1)
- `firstUsableInt`, `lastUsableInt`, `describeSubnet(ip, prefix) → SubnetInfo`, `ipClassOf`
- `parseCIDR("10.0.0.5/16")`, `splitSubnet(net, p, newP)` (null if `newP < p` or >1024 blocks), `prefixForHosts(n)`, `vlsmAllocate(base, p, hosts[])` (largest-first, boundary-aligned, null on overflow)

Conventions: addresses as unsigned 32-bit ints (`>>> 0`); per-octet AND to dodge signed-bitwise traps; `Math.pow(2, k)` for sizes, never `1 << k` for k≥31.

## Page pattern (follow for future tools)

- `src/app/<route>/page.tsx` — Server Component, static `metadata` (unique title+description), renders `<ToolShell>` + `<Calculator/>`.
- `src/app/<route>/calculator.tsx` — `'use client'`, `useState` inputs + `useMemo` result, `ErrorBox` on invalid, `CopyButton` + Reset, results via `ResultRow`/table. No server calls.
- `ToolShell` props: `title, description, children, example, explanation, faqs[{q,a}], related[{href,label}]`.

## Verification

1. `npm test` — 13/13 pass (12 subnet + 1 sample).
2. `npx tsc --noEmit` — clean.
3. `npx next build` — clean, 17 static routes.
4. Manual spot checks: `192.168.1.10/24` full info; `/24→/26` split = 4 blocks; VLSM `[100,50,10]` in `/24` → `/25,/26,/28`; `255.0.255.0` rejected as non-contiguous.

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
