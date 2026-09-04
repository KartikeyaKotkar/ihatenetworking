import { describe, it, expect } from "vitest";
import {
  validateIPv4Detailed,
  ipv4StringToBinary,
  binaryToIPv4String,
  scopeOfIPv4,
  parseIPv4,
  describeIPRange,
  generateIPRange,
} from "@/lib/ipv4";
import {
  parseIPv6,
  isValidIPv6,
  expandIPv6,
  compressIPv6,
  describeIPv6Subnet,
} from "@/lib/ipv6";

describe("ip tools ipv4", () => {
  it("validates with reasons", () => {
    expect(validateIPv4Detailed("192.168.1.1").valid).toBe(true);
    const bad = validateIPv4Detailed("192.168.1.256");
    expect(bad.valid).toBe(false);
    expect(bad.reason).toMatch(/Octet 4/);
    expect(validateIPv4Detailed("1.2.3").valid).toBe(false);
    expect(validateIPv4Detailed("").valid).toBe(false);
  });
  it("ipv4 to binary", () => {
    expect(ipv4StringToBinary("192.168.1.10")).toBe("11000000.10101000.00000001.00001010");
    expect(ipv4StringToBinary("0.0.0.0")).toBe("00000000.00000000.00000000.00000000");
    expect(ipv4StringToBinary("nope")).toBeNull();
  });
  it("binary to ipv4 dotted + plain", () => {
    expect(binaryToIPv4String("11000000.10101000.00000001.00001010")).toBe("192.168.1.10");
    expect(binaryToIPv4String("11000000101010000000000100001010")).toBe("192.168.1.10");
    expect(binaryToIPv4String("101")).toBeNull();
    expect(binaryToIPv4String("11000000.10101000.00000001.0000101X")).toBeNull();
  });
  it("scope classification", () => {
    expect(scopeOfIPv4(parseIPv4("10.5.6.7")!).scope).toBe("private");
    expect(scopeOfIPv4(parseIPv4("192.168.1.1")!).private).toBe(true);
    expect(scopeOfIPv4(parseIPv4("127.0.0.1")!).scope).toBe("loopback");
    expect(scopeOfIPv4(parseIPv4("169.254.5.5")!).scope).toBe("link-local");
    expect(scopeOfIPv4(parseIPv4("8.8.8.8")!).scope).toBe("public");
    expect(scopeOfIPv4(parseIPv4("100.64.0.1")!).scope).toBe("carrier-grade-nat");
    expect(scopeOfIPv4(parseIPv4("224.0.0.1")!).scope).toBe("multicast");
    expect(scopeOfIPv4(parseIPv4("255.255.255.255")!).scope).toBe("broadcast");
  });
  it("range describe + generate", () => {
    expect(describeIPRange("192.168.1.1", "192.168.1.5")!.count).toBe(5);
    expect(describeIPRange("192.168.1.5", "192.168.1.1")).toBeNull();
    expect(generateIPRange("10.0.0.1", "10.0.0.3")).toEqual(["10.0.0.1", "10.0.0.2", "10.0.0.3"]);
    expect(generateIPRange("10.0.0.0", "10.0.5.0")).toBeNull(); // over 256 cap
  });
});

describe("ipv6", () => {
  it("parses full + compressed + invalid", () => {
    expect(isValidIPv6("2001:db8::1")).toBe(true);
    expect(isValidIPv6("::1")).toBe(true);
    expect(isValidIPv6("::")).toBe(true);
    expect(isValidIPv6("2001:db8:::1")).toBe(false);
    expect(isValidIPv6("12345::")).toBe(false);
    expect(isValidIPv6("not-ip")).toBe(false);
  });
  it("expand + compress round trip", () => {
    const b = parseIPv6("2001:db8::1")!;
    expect(expandIPv6(b)).toBe("2001:0db8:0000:0000:0000:0000:0000:0001");
    expect(compressIPv6(b)).toBe("2001:db8::1");
    expect(compressIPv6(parseIPv6("::1")!)).toBe("::1");
    expect(compressIPv6(parseIPv6("::")!)).toBe("::");
    // single zero group not compressed per RFC 5952
    expect(compressIPv6(parseIPv6("2001:db8:0:1:1:1:1:1")!)).toBe("2001:db8:0:1:1:1:1:1");
  });
  it("embedded ipv4", () => {
    expect(isValidIPv6("::ffff:192.0.2.1")).toBe(true);
  });
  it("subnet /64", () => {
    const s = describeIPv6Subnet("2001:db8::1", 64)!;
    expect(s.network).toBe("2001:db8::");
    expect(s.totalAddresses).toBe(1n << 64n);
    expect(s.lastAddress).toBe("2001:db8::ffff:ffff:ffff:ffff");
  });
  it("subnet /128 single", () => {
    const s = describeIPv6Subnet("::1", 128)!;
    expect(s.totalAddresses).toBe(1n);
    expect(s.network).toBe("::1");
  });
});
