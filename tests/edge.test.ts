import { describe, it, expect } from "vitest";
import {
  describeSubnet,
  maskStringToPrefix,
  prefixToMaskString,
  splitSubnet,
  vlsmAllocate,
  usableHostCount,
  scopeOfIPv4,
  parseIPv4,
} from "@/lib/ipv4";
import { isDnsType, validLookupName, isNonPublicIp, validHttpUrl } from "@/lib/dns";

describe("ipv4 edge cases", () => {
  it("0.0.0.0/0 full range", () => {
    const s = describeSubnet("0.0.0.0", 0)!;
    expect(s.network).toBe("0.0.0.0");
    expect(s.broadcast).toBe("255.255.255.255");
    expect(s.firstUsable).toBe("0.0.0.1");
    expect(s.lastUsable).toBe("255.255.255.254");
    expect(prefixToMaskString(0)).toBe("0.0.0.0");
  });
  it("/31 and /32 ranges", () => {
    const a = describeSubnet("192.168.1.0", 31)!;
    expect(a.firstUsable).toBe("192.168.1.0");
    expect(a.lastUsable).toBe("192.168.1.1");
    expect(a.usableHosts).toBe(2);
    const b = describeSubnet("10.0.0.7", 32)!;
    expect(b.network).toBe("10.0.0.7");
    expect(b.broadcast).toBe("10.0.0.7");
    expect(b.usableHosts).toBe(1);
    expect(usableHostCount(31)).toBe(2);
  });
  it("contiguous mask validation incl /0 /32", () => {
    expect(maskStringToPrefix("0.0.0.0")).toBe(0);
    expect(maskStringToPrefix("255.255.255.255")).toBe(32);
    expect(maskStringToPrefix("255.255.255.254")).toBe(31);
    expect(maskStringToPrefix("255.0.255.0")).toBeNull();
    expect(maskStringToPrefix("0.0.0.1")).toBeNull();
  });
  it("split cap + vlsm overflow", () => {
    expect(splitSubnet("10.0.0.0", 8, 24)).toBeNull(); // 65k > 1024 cap
    expect(splitSubnet("10.0.0.0", 24, 24)).toEqual(["10.0.0.0/24"]);
    expect(vlsmAllocate("192.168.1.0", 30, [10])).toBeNull(); // /30 fits 2 only
    expect(vlsmAllocate("192.168.1.0", 24, [])).toBeNull();
  });
  it("documentation + reserved scopes", () => {
    expect(scopeOfIPv4(parseIPv4("192.0.2.1")!).scope).toBe("reserved");
    expect(scopeOfIPv4(parseIPv4("198.51.100.9")!).scope).toBe("reserved");
    expect(scopeOfIPv4(parseIPv4("203.0.113.9")!).scope).toBe("reserved");
    expect(scopeOfIPv4(parseIPv4("8.8.8.8")!).scope).toBe("public");
  });
});

describe("server guards (pure, no network)", () => {
  it("hostname allowlist", () => {
    expect(validLookupName("example.com")).toBe(true);
    expect(validLookupName("localhost")).toBe(true);
    expect(validLookupName("8.8.8.8")).toBe(true);
    expect(validLookupName("a..b.com")).toBe(false);
    expect(validLookupName("bad host!")).toBe(false);
    expect(validLookupName("")).toBe(false);
    expect(validLookupName("-lead.com")).toBe(false);
  });
  it("dns type guard", () => {
    expect(isDnsType("mx")).toBe(true);
    expect(isDnsType("SOA")).toBe(false);
  });
  it("non-public ip detection", () => {
    for (const ip of ["10.1.2.3", "172.16.0.1", "172.31.255.255", "192.168.0.1", "127.0.0.1", "169.254.1.1", "0.1.2.3", "224.0.0.1", "100.64.0.1", "::1", "::", "fe80::1", "fc00::1", "ff02::1", "2001:db8::1"]) {
      expect(isNonPublicIp(ip)).toBe(true);
    }
    expect(isNonPublicIp("8.8.8.8")).toBe(false);
    expect(isNonPublicIp("1.1.1.1")).toBe(false);
    expect(isNonPublicIp("2001:4860:4860::8888")).toBe(false);
    expect(isNonPublicIp("172.32.0.1")).toBe(false); // just above 172.31
    expect(isNonPublicIp("172.15.0.1")).toBe(false); // just below 172.16
  });
  it("url guard", () => {
    expect(validHttpUrl("example.com")?.protocol).toBe("https:");
    expect(validHttpUrl("http://example.com/path?q=1")?.hostname).toBe("example.com");
    expect(validHttpUrl("ftp://example.com")).toBeNull();
    expect(validHttpUrl("not a url !!!")).toBeNull();
  });
});
