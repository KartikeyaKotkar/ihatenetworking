import { describe, it, expect } from "vitest";
import {
  parseIPv4,
  ipv4ToString,
  prefixToMaskString,
  prefixToWildcardString,
  maskStringToPrefix,
  networkAddressInt,
  broadcastAddressInt,
  usableHostCount,
  describeSubnet,
  parseCIDR,
  splitSubnet,
  vlsmAllocate,
  prefixForHosts,
} from "@/lib/ipv4";

describe("ipv4 core", () => {
  it("parses and round-trips", () => {
    expect(parseIPv4("192.168.1.10")).toBe(3232235786);
    expect(ipv4ToString(3232235786)).toBe("192.168.1.10");
    expect(ipv4ToString(0)).toBe("0.0.0.0");
    expect(ipv4ToString(4294967295)).toBe("255.255.255.255");
  });
  it("rejects invalid", () => {
    expect(parseIPv4("999.1.1.1")).toBeNull();
    expect(parseIPv4("1.2.3")).toBeNull();
    expect(parseIPv4("1.2.3.4.5")).toBeNull();
    expect(parseIPv4("abc")).toBeNull();
    expect(parseIPv4("")).toBeNull();
    expect(parseIPv4("1.2.3.-1")).toBeNull();
  });
  it("prefix/mask/wildcard", () => {
    expect(prefixToMaskString(24)).toBe("255.255.255.0");
    expect(prefixToMaskString(0)).toBe("0.0.0.0");
    expect(prefixToMaskString(32)).toBe("255.255.255.255");
    expect(prefixToWildcardString(24)).toBe("0.0.0.255");
    expect(prefixToWildcardString(16)).toBe("0.0.255.255");
    expect(maskStringToPrefix("255.255.255.0")).toBe(24);
    expect(maskStringToPrefix("255.0.255.0")).toBeNull();
  });
  it("network/broadcast for 192.168.1.10/24", () => {
    const ip = parseIPv4("192.168.1.10")!;
    expect(ipv4ToString(networkAddressInt(ip, 24))).toBe("192.168.1.0");
    expect(ipv4ToString(broadcastAddressInt(ip, 24))).toBe("192.168.1.255");
  });
  it("usable hosts edge cases", () => {
    expect(usableHostCount(24)).toBe(254);
    expect(usableHostCount(31)).toBe(2);
    expect(usableHostCount(32)).toBe(1);
    expect(usableHostCount(30)).toBe(2);
  });
  it("describeSubnet full", () => {
    const s = describeSubnet("10.0.0.1", 8)!;
    expect(s.network).toBe("10.0.0.0");
    expect(s.broadcast).toBe("10.255.255.255");
    expect(s.firstUsable).toBe("10.0.0.1");
    expect(s.lastUsable).toBe("10.255.255.254");
    expect(s.usableHosts).toBe(16777214);
  });
  it("parseCIDR", () => {
    const c = parseCIDR("10.0.0.5/16")!;
    expect(ipv4ToString(c.network)).toBe("10.0.0.0");
    expect(parseCIDR("nope")).toBeNull();
  });
  it("splitSubnet /24 into /26", () => {
    const out = splitSubnet("192.168.1.0", 24, 26)!;
    expect(out).toEqual([
      "192.168.1.0/26",
      "192.168.1.64/26",
      "192.168.1.128/26",
      "192.168.1.192/26",
    ]);
  });
  it("splitSubnet rejects shrinking prefix", () => {
    expect(splitSubnet("192.168.1.0", 24, 16)).toBeNull();
  });
  it("prefixForHosts", () => {
    expect(prefixForHosts(1)).toBe(32);
    expect(prefixForHosts(2)).toBe(31);
    expect(prefixForHosts(50)).toBe(26);
    expect(prefixForHosts(254)).toBe(24);
  });
  it("vlsmAllocate fits", () => {
    const blocks = vlsmAllocate("192.168.1.0", 24, [100, 50, 10])!;
    expect(blocks.length).toBe(3);
    expect(blocks[0].network).toBe("192.168.1.0/25");
    expect(blocks[1].network).toBe("192.168.1.128/26");
    // third block aligned to /28 boundary
    expect(blocks[2].prefix).toBe(28);
  });
  it("vlsmAllocate overflow returns null", () => {
    expect(vlsmAllocate("192.168.1.0", 24, [300])).toBeNull();
  });
});
