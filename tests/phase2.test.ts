import { describe, it, expect } from "vitest";
import { parseMac, formatMac, validateMacDetailed } from "@/lib/mac";
import { parseHexBytes, decodeIPv4Header, decodeTCPHeader, decodeUDPHeader, decodeEthernetFrame, lookupIcmp } from "@/lib/packets";
import { parseBits, requiredBandwidth, throughput, latencyBreakdown, transferSeconds, effectiveMtu, mssFor, bdpWindow, humanDuration } from "@/lib/netcalc";

describe("mac", () => {
  it("parses all forms", () => {
    expect(parseMac("00:1B:44:11:3A:B7")).toEqual([0, 27, 68, 17, 58, 183]);
    expect(parseMac("00-1b-44-11-3a-b7")).toEqual([0, 27, 68, 17, 58, 183]);
    expect(parseMac("001B.4411.3AB7")).toEqual([0, 27, 68, 17, 58, 183]);
    expect(parseMac("001b44113ab7")).toEqual([0, 27, 68, 17, 58, 183]);
    expect(parseMac("00:1B:44:11:3A")).toBeNull();
    expect(parseMac("00:1B:44:11:3A:ZZ")).toBeNull();
  });
  it("formats + flags", () => {
    const f = formatMac("00:1b:44:11:3a:b7")!;
    expect(f.canonical).toBe("00:1B:44:11:3A:B7");
    expect(f.dotCisco).toBe("001b.4411.3ab7");
    expect(f.universal).toBe(true);
    expect(formatMac("ff:ff:ff:ff:ff:ff")!.unicast).toBe(false);
    expect(formatMac("02:00:00:00:00:01")!.universal).toBe(false);
    expect(validateMacDetailed("nope").valid).toBe(false);
  });
});

describe("packets", () => {
  it("ipv4 header", () => {
    const h = decodeIPv4Header("4500003cabcd4000400600000a0000010a000002")!;
    expect(h.ttl).toBe(64);
    expect(h.protocolName).toBe("TCP");
    expect(h.src).toBe("10.0.0.1");
    expect(h.dst).toBe("10.0.0.2");
    expect(h.flags).toContain("DF (Don't Fragment)");
    expect(decodeIPv4Header("60000000000000000000000000000000")).toBeNull(); // v6
    expect(decodeIPv4Header("zz")).toBeNull();
  });
  it("tcp/udp/ethernet", () => {
    const t = decodeTCPHeader("3039c3b8123456789abcdef0501220000e730000")!;
    expect(t.srcPort).toBe(12345);
    expect(t.dstPort).toBe(50104); // 0xC3B8
    expect(t.headerBytes).toBe(20);
    expect(t.flags).toContain("SYN");
    expect(t.flags).toContain("ACK");
    const u = decodeUDPHeader("0035c3b8001c2a9c")!;
    expect(u.srcPort).toBe(53);
    expect(u.length).toBe(28);
    const e = decodeEthernetFrame("ffffffffffff001b44113ab70800")!;
    expect(e.dstMac).toBe("FF:FF:FF:FF:FF:FF");
    expect(e.etherTypeName).toBe("IPv4");
    expect(decodeUDPHeader("00")).toBeNull();
  });
  it("icmp lookup", () => {
    expect(lookupIcmp(8)?.name).toBe("Echo Request");
    expect(lookupIcmp(3)?.codes.length).toBeGreaterThan(5);
    expect(lookupIcmp(99)).toBeNull();
  });
});

describe("netcalc", () => {
  it("parse + plan math", () => {
    expect(parseBits("100 Mbps")).toBe(100e6);
    expect(parseBits("1 GiB")).toBe(8 * 1024 ** 3);
    expect(parseBits("100", "Mb")).toBe(100e6);
    expect(parseBits("nope")).toBeNull();
    expect(requiredBandwidth(100, 5e6, 10)).toBe(550e6);
    expect(throughput(100 * 8e6, 8)).toBe(100e6);
    expect(transferSeconds(8e9, 100e6, 0)).toBe(80);
    expect(humanDuration(80)).toBe("1 min 20 s");
    expect(effectiveMtu(1500, [8])).toBe(1492);
    expect(effectiveMtu(1500, [2000])).toBeNull();
    expect(mssFor(1500, false, false)).toBe(1460);
    expect(mssFor(1500, true, true)).toBe(1428);
    const w = bdpWindow(100e6, 50)!;
    expect(w.bytes).toBe(625000);
    expect(w.scaleNeeded).toBe(true);
    const lat = latencyBreakdown(1000, "fiber", 12000, 1e9)!;
    expect(lat.propagationMs).toBeCloseTo(5, 5);
  });
});
