// Base converters. Arbitrary precision via BigInt. Strict validation, null on invalid.

function clean(s: string): string {
  return s.trim().replace(/[\s_]/g, "");
}

function stripPrefix(s: string, prefixes: string[]): string {
  for (const p of prefixes) {
    if (s.toLowerCase().startsWith(p)) return s.slice(p.length);
  }
  return s;
}

export function hexToBin(hex: string): string | null {
  let s = stripPrefix(clean(hex), ["0x"]);
  if (!/^[0-9a-fA-F]+$/.test(s)) return null;
  let out = "";
  for (const c of s) out += parseInt(c, 16).toString(2).padStart(4, "0");
  out = out.replace(/^0+(?=.)/, "");
  return out;
}

export function binToHex(bin: string): string | null {
  let s = stripPrefix(clean(bin), ["0b"]);
  if (!/^[01]+$/.test(s)) return null;
  const pad = (4 - (s.length % 4)) % 4;
  s = "0".repeat(pad) + s;
  let out = "";
  for (let i = 0; i < s.length; i += 4) out += parseInt(s.slice(i, i + 4), 2).toString(16).toUpperCase();
  out = out.replace(/^0+(?=.)/, "");
  return out;
}

export function decToBin(dec: string): string | null {
  const s = clean(dec);
  if (!/^\d+$/.test(s)) return null;
  try {
    return BigInt(s).toString(2);
  } catch {
    return null;
  }
}

export function binToDec(bin: string): string | null {
  let s = stripPrefix(clean(bin), ["0b"]);
  if (!/^[01]+$/.test(s)) return null;
  try {
    return BigInt("0b" + s).toString(10);
  } catch {
    return null;
  }
}

export function hexToDec(hex: string): string | null {
  let s = stripPrefix(clean(hex), ["0x"]);
  if (!/^[0-9a-fA-F]+$/.test(s)) return null;
  try {
    return BigInt("0x" + s).toString(10);
  } catch {
    return null;
  }
}

export function decToHex(dec: string): string | null {
  const s = clean(dec);
  if (!/^\d+$/.test(s)) return null;
  try {
    return BigInt(s).toString(16).toUpperCase();
  } catch {
    return null;
  }
}
