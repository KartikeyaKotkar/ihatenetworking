// MAC address helpers. Pure, client-safe.

export interface MacInfo {
  canonical: string;
  colonLower: string;
  hyphenUpper: string;
  dotCisco: string;
  plain: string;
  unicast: boolean;
  universal: boolean;
  oui: string;
}

export function parseMac(input: string): number[] | null {
  if (typeof input !== "string") return null;
  let s = input.trim().toLowerCase().replace(/^0x/, "");
  let hex: string;
  if (s.includes(".")) {
    // Cisco dotted: xxxx.xxxx.xxxx
    const parts = s.split(".");
    if (parts.length !== 3) return null;
    for (const p of parts) {
      if (!/^[0-9a-f]{4}$/.test(p)) return null;
    }
    hex = parts.join("");
  } else {
    const sep = s.includes(":") ? ":" : s.includes("-") ? "-" : null;
    if (sep) {
      const parts = s.split(sep);
      if (parts.length !== 6) return null;
      for (const p of parts) {
        if (!/^[0-9a-f]{2}$/.test(p)) return null;
      }
      hex = parts.join("");
    } else {
      if (!/^[0-9a-f]{12}$/.test(s)) return null;
      hex = s;
    }
  }
  const bytes: number[] = [];
  for (let i = 0; i < 12; i += 2) bytes.push(parseInt(hex.slice(i, i + 2), 16));
  return bytes;
}

export function isValidMac(input: string): boolean {
  return parseMac(input) !== null;
}

export function formatMac(input: string): MacInfo | null {
  const b = parseMac(input);
  if (!b) return null;
  const hx = b.map((x) => x.toString(16).padStart(2, "0"));
  const upper = hx.map((x) => x.toUpperCase());
  return {
    canonical: upper.join(":"),
    colonLower: hx.join(":"),
    hyphenUpper: upper.join("-"),
    dotCisco: `${hx[0]}${hx[1]}.${hx[2]}${hx[3]}.${hx[4]}${hx[5]}`,
    plain: upper.join(""),
    unicast: (b[0] & 1) === 0,
    universal: (b[0] & 2) === 0,
    oui: upper.slice(0, 3).join(":"),
  };
}

export function validateMacDetailed(input: string): { valid: boolean; reason: string } {
  if (typeof input !== "string" || input.trim().length === 0)
    return { valid: false, reason: "Empty input. Try 00:1B:44:11:3A:B7." };
  const s = input.trim();
  if (parseMac(s) !== null) return { valid: true, reason: "Valid MAC address." };
  if (/[^0-9a-fA-F:.\-x]/.test(s)) return { valid: false, reason: "Illegal characters. Use hex digits plus : - or . separators." };
  const stripped = s.replace(/[:.\-]/g, "");
  if (!/^[0-9a-fA-F]*$/.test(stripped)) return { valid: false, reason: "Non-hex digits present. MAC uses 0-9 and A-F only." };
  if (stripped.length !== 12)
    return { valid: false, reason: `Wrong length: ${stripped.length} hex digits, need exactly 12 (6 bytes).` };
  return { valid: false, reason: "Bad grouping. Use 6 pairs (00:1B:44:11:3A:B7), or Cisco xxxx.xxxx.xxxx." };
}
