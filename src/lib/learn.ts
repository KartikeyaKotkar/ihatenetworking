// Practice question generators. Pure; rand injectable for tests.
// Every generator returns exactly 4 unique options with `answer` among them.

import {
  parseIPv4, ipv4ToString, prefixToMaskString, prefixToWildcardString,
  networkAddressInt, usableHostCount, prefixForHosts, scopeOfIPv4,
} from "@/lib/ipv4";
import { allPorts } from "@/lib/ports";

export interface Question {
  prompt: string;
  options: string[];
  answer: string;
  hint: string;
}

type Rand = () => number;

function int(rand: Rand, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

function shuffle<T>(arr: T[], rand: Rand): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fillOptions(correct: string, wrongs: string[], rand: Rand): string[] {
  const set = new Set<string>([correct]);
  for (const w of shuffle(wrongs, rand)) {
    if (set.size >= 4) break;
    set.add(w);
  }
  // Fallback padding (should not trigger with sane generators)
  let n = 0;
  while (set.size < 4) set.add(`${correct} (${++n})`);
  return shuffle([...set], rand);
}

function randomIp(rand: Rand): number {
  // Avoid 0/127/224+ first octets for classroom-style questions
  const first = int(rand, 1, 223);
  if (first === 127) return randomIp(rand);
  return (((first * 256 + int(rand, 0, 255)) * 256 + int(rand, 0, 255)) * 256 + int(rand, 0, 255)) >>> 0;
}

/** Ask network address for random IP/prefix. */
export function subnetQuestion(rand: Rand = Math.random): Question {
  const ip = randomIp(rand);
  const prefix = int(rand, 16, 30);
  const net = ipv4ToString(networkAddressInt(ip, prefix));
  const bcastLast = (networkAddressInt(ip, prefix) + Math.pow(2, 32 - prefix) - 1) >>> 0;
  return {
    prompt: `What is the network address of ${ipv4ToString(ip)}/${prefix}?`,
    options: fillOptions(net, [
      ipv4ToString(bcastLast),
      ipv4ToString((networkAddressInt(ip, prefix) + 1) >>> 0),
      `${ipv4ToString(ip)}`,
    ], rand),
    answer: net,
    hint: "Network = IP with all host bits zeroed.",
  };
}

/** Ask mask or prefix, randomly flipped. */
export function cidrQuestion(rand: Rand = Math.random): Question {
  const prefix = int(rand, 8, 30);
  if (rand() < 0.5) {
    const mask = prefixToMaskString(prefix);
    return {
      prompt: `Which subnet mask is /${prefix}?`,
      options: fillOptions(mask, [prefixToMaskString(prefix + 1), prefixToMaskString(prefix - 1), prefixToWildcardString(prefix)], rand),
      answer: mask,
      hint: `/${prefix} = ${prefix} one-bits, then zeros.`,
    };
  }
  const mask = prefixToMaskString(prefix);
  return {
    prompt: `Which prefix is ${mask}?`,
    options: fillOptions(`/${prefix}`, [`/${prefix + 1}`, `/${prefix - 1}`, `/${prefix + 2}`], rand),
    answer: `/${prefix}`,
    hint: "Count the leading one-bits.",
  };
}

/** Ask smallest prefix fitting host count. */
export function vlsmQuestion(rand: Rand = Math.random): Question {
  const need = int(rand, 5, 500);
  const p = prefixForHosts(need)!;
  const usable = usableHostCount(p);
  return {
    prompt: `A subnet must fit ${need} hosts. Smallest prefix that works?`,
    options: fillOptions(`/${p}`, [`/${p + 1 > 32 ? 32 : p + 1}`, `/${p - 1 < 0 ? 0 : p - 1}`, `/${p + 2 > 32 ? 32 : p + 2}`], rand),
    answer: `/${p}`,
    hint: `/${p} fits ${usable} usable hosts.`,
  };
}

/** Ask wildcard for prefix. */
export function wildcardQuestion(rand: Rand = Math.random): Question {
  const prefix = int(rand, 8, 30);
  const wild = prefixToWildcardString(prefix);
  return {
    prompt: `What is the wildcard mask for /${prefix}?`,
    options: fillOptions(wild, [
      prefixToMaskString(prefix),
      prefixToWildcardString(prefix + 1),
      prefixToWildcardString(prefix - 1),
    ], rand),
    answer: wild,
    hint: "Wildcard = 255.255.255.255 minus mask.",
  };
}

/** Classify a curated-or-random IP by scope. */
const SCOPE_POOL = ["10.5.6.7", "172.20.1.9", "192.168.0.12", "8.8.8.8", "127.0.0.1", "169.254.5.5", "224.0.0.1", "100.64.0.9", "11.0.0.5", "1.1.1.1"];

export function ipQuizQuestion(rand: Rand = Math.random): Question {
  const ipStr = SCOPE_POOL[int(rand, 0, SCOPE_POOL.length - 1)];
  const label = scopeOfIPv4(parseIPv4(ipStr)!)!.label;
  const short = label.split("(")[0].trim();
  return {
    prompt: `How is ${ipStr} classified?`,
    options: fillOptions(short, ["Private (10.0.0.0/8, RFC 1918)", "Public (globally routable)", "Loopback (127.0.0.0/8)", "Multicast (224.0.0.0/4)", "Link-local (169.254.0.0/16, APIPA)"], rand),
    answer: short,
    hint: "Check first octet against RFC 1918 + special ranges.",
  };
}

/** Ask service name for a well-known port. */
export function portQuizQuestion(rand: Rand = Math.random): Question {
  const pool = allPorts().filter((p) => p.port <= 1024);
  const pick = pool[int(rand, 0, pool.length - 1)];
  const others = shuffle(pool.filter((p) => p.service !== pick.service), rand).slice(0, 6).map((p) => p.service);
  return {
    prompt: `Which service runs on port ${pick.port}/${pick.protocol}?`,
    options: fillOptions(pick.service, others, rand),
    answer: pick.service,
    hint: `${pick.description}.`,
  };
}
