# "Did You Ping It" — Implementation Plan (living doc)

Last updated: 2026-09-04. Scope of this update: **Phase 1 MVP COMPLETE. All 41 tools live (12 subnetting + 9 IP tools + 9 lookups + 5 utilities + 6 converters).**

## Status

- [x] Framework: Next.js 16.3.3 App Router + TypeScript + Tailwind 4, `src/` layout. Dark muted theme, glass panels.
- [x] Core lib IPv4: `src/lib/ipv4.ts` — integer-safe subnet math + IP-tools helpers (validation with reasons, binary converters, scope classifier, range describe/generate).
- [x] Core lib IPv6: `src/lib/ipv6.ts` — BigInt-based parse/expand/compress (RFC 5952) + subnet calc + CIDR parse. tsconfig target ES2017 → ES2020 for BigInt literals.
- [x] Libs: `src/lib/converters.ts` (BigInt hex/bin/dec, strict, null on invalid), `src/lib/ports.ts` (~65 common ports + search + range class), `src/lib/http-status.ts` (36 codes + search), `src/lib/dns.ts` (**server-only**: node:dns wrappers, hostname allowlist, SSRF guard rejecting private targets).
- [x] API routes (dynamic, `force-dynamic`): `/api/dns?name=&type=` (A/AAAA/MX/CNAME/TXT/NS, 8s timeout, readable 404s), `/api/dns/reverse?ip=`, `/api/headers?url=` (SSRF-guarded, 12s abort, manual redirect), `/api/ping?host=` (system ping ICMP first, TCP-connect fallback labeled honestly), `/api/traceroute?host=&maxHops=` (traceroute→tracepath fallback, honest 501 when binaries missing).
- [x] 12 subnetting + 9 IP-tools + 6 converters + 4 lookup/URL pages: static, client-side, unique metadata + FAQ + related.
- [x] 7 DNS + header + ping + traceroute pages: static shells, client fetch to APIs with loading/error states.
- [x] Homepage: command-palette search (`SearchPalette`: Ctrl/Cmd+K, autofocus, arrow keys + Enter, Esc, ARIA dialog/listbox), sticky sidebar (categories + counts + privacy note, `lg:` only), big cards (`p-6`, `text-base`), grey `hover:border-zinc-500` + `focus-visible:ring-zinc-500` everywhere, zero neon hover. Old inline `ToolSearch.tsx` deleted.
- [x] Tests: subnet (12) + iptools (10) + remaining converters/ports/status (4) + homepage index/search (4) + sample. `npm test` green (31 pass).
- [x] Typecheck + `next build` green (41 static tool pages + `/`, `/_not-found`, `/sitemap.xml` + 5 dynamic APIs).
- [ ] Phase 2/3/4 (MAC, packet decoders, bandwidth calcs, Cisco, learning) — see `extra/didyoupingit.md` §5-7. NOT started.

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

## Routes (Phase 1 Lookups #22-30, Utilities #31-35, Converters #36-41)

| # | Tool | Route | Mode |
|---|------|-------|------|
| 22 | Port Number Lookup | `/port-number-lookup` | client, static dataset |
| 23 | HTTP Status Code Lookup | `/http-status-code-lookup` | client, static dataset |
| 24 | DNS Lookup | `/dns-lookup` | server via `/api/dns` |
| 25 | Reverse DNS Lookup | `/reverse-dns-lookup` | server via `/api/dns/reverse` |
| 26 | MX Record Lookup | `/mx-record-lookup` | server via `/api/dns` |
| 27 | A Record Lookup | `/a-record-lookup` | server via `/api/dns` |
| 28 | CNAME Lookup | `/cname-lookup` | server via `/api/dns` |
| 29 | TXT Record Lookup | `/txt-record-lookup` | server via `/api/dns` |
| 30 | NS Record Lookup | `/ns-record-lookup` | server via `/api/dns` |
| 31 | Ping Tester | `/ping-tester` | server via `/api/ping` |
| 32 | Traceroute | `/traceroute` | server via `/api/traceroute` |
| 33 | HTTP Header Checker | `/http-header-checker` | server via `/api/headers` |
| 34 | URL Parser | `/url-parser` | client, built-in URL API |
| 35 | URL Encoder/Decoder | `/url-encoder-decoder` | client, encodeURIComponent |
| 36 | Hex to Binary | `/hex-to-binary` | client, BigInt |
| 37 | Binary to Hex | `/binary-to-hex` | client, BigInt |
| 38 | Decimal to Binary | `/decimal-to-binary` | client, BigInt |
| 39 | Binary to Decimal | `/binary-to-decimal` | client, BigInt |
| 40 | Hex to Decimal | `/hex-to-decimal` | client, BigInt |
| 41 | Decimal to Hex | `/decimal-to-hex` | client, BigInt |

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

## Homepage structure (§3 done)

- `src/lib/tools.ts`: single index, 41 entries `{href, title, desc, category, keywords, popular?, recent?}`, `CATEGORIES` (8, Cisco empty with Phase 3 blurb), `toolsByCategory()` (calculators = curated cross-links, cisco = []), `searchTools()` (all query words must match, title ×3).
- `src/components/ToolSearch.tsx`: client search, placeholder "What networking problem are you solving?", live results as links.
- `src/app/page.tsx`: hero + search, Popular (10), category cards → anchored sections, Recently added (8), privacy (client-side vs server-side split stated honestly).

## §4 Technical priorities audit (Phase 1.4)

- Stack: Next.js App Router + TypeScript + Tailwind, static pages + client calcs. Done.
- Structure deviation (deliberate): no `src/tools/` dir — calculators colocate as `src/app/<route>/calculator.tsx` (idiomatic App Router, keeps server/client boundary explicit). No `src/lib/subnetting.ts` — subnet math lives in `ipv4.ts` (single uint32 domain, no float). Lib is per-domain: `ipv4`, `ipv6`, `converters`, `ports`, `http-status`, `dns` (server-only), `tools` (index/search).
- Separation: pure lib functions, zero UI imports. Unit tests: 40 pass (`subnet`, `iptools`, `remaining`, `homepage`, `edge`).
- Invalid input: every page has explicit `ErrorBox` paths; API routes return 400/403/404/501/502 with human messages.
- Edge cases: /31 (RFC 3021), /32, 0.0.0.0/0, non-contiguous masks, split cap 1024, VLSM overflow, TEST-NET + CGNAT scopes, single-zero-group IPv6 (RFC 5952).
- Integer safety: uint32 `>>> 0` + per-octet AND + `Math.pow` sizes; IPv6 BigInt shifts. Audit found no `1 << k` address math.
- Bugs caught by new edge tests (fixed): TEST-NET-2 matched wrong octet (`third === 51` instead of `second === 51 && third === 100`); `validHttpUrl` let `ftp://` hide behind prepended `https://` (now rejects non-HTTP schemes + uses fixed variable).

## Verification

1. `npm test` — 40/40 pass (12 subnet + 10 iptools + 4 converters/ports/status + 4 homepage index + 9 edge/guards + 1 sample).
2. `npx tsc --noEmit` — clean.
3. `npx next build` — clean, 41 static tool pages + 5 dynamic APIs.
4. Live `next start` smoke test: bad hostname → 400 JSON; valid DNS in sandbox → graceful 502 ("DNS server failed or timed out", sandbox blocks outbound DNS — deploy env differs); private ping target → 403 SSRF refusal. System `ping`/`traceroute` binaries present locally; ping 8.8.8.8 ICMP OK.
5. Spot checks: `192.168.1.10/24` full info; `/24→/26` split = 4 blocks; VLSM `[100,50,10]` → `/25,/26,/28`; `255.0.255.0` rejected; `2001:db8::1/64` → network `2001:db8::`; `::ffff:192.0.2.1` valid; `FF↔11111111↔255` converters round-trip incl. 2^64.

## Sandbox limits (not code bugs)

- Outbound DNS blocked here (`ETIMEOUT` on direct node:dns). DNS/headers pages show graceful errors locally; verify on deploy.
- Traceroute/ping ICMP need system binaries + raw socket perms; code falls back (TCP ping) or 501s honestly.

## Known limits / next fixes

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
