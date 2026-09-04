import { describe, it, expect } from "vitest";
import { hexToBin, binToHex, decToBin, binToDec, hexToDec, decToHex } from "@/lib/converters";
import { lookupPort, searchPorts, wellKnownRange } from "@/lib/ports";
import { lookupStatus, searchStatuses } from "@/lib/http-status";

describe("converters", () => {
  it("hex/bin round trip", () => {
    expect(hexToBin("FF")).toBe("11111111");
    expect(hexToBin("0x0")).toBe("0");
    expect(binToHex("11111111")).toBe("FF");
    expect(binToHex("0b101")).toBe("5");
    expect(hexToBin("zz")).toBeNull();
    expect(binToHex("102")).toBeNull();
  });
  it("decimal conversions incl big", () => {
    expect(decToBin("255")).toBe("11111111");
    expect(binToDec("11111111")).toBe("255");
    expect(hexToDec("FF")).toBe("255");
    expect(decToHex("255")).toBe("FF");
    expect(decToBin("18446744073709551616")).toBe("1" + "0".repeat(64)); // 2^64
    expect(decToBin("-1")).toBeNull();
    expect(binToDec("")).toBeNull();
  });
});

describe("ports", () => {
  it("lookup known + unknown + invalid", () => {
    expect(lookupPort(443)?.service).toBe("HTTPS");
    expect(lookupPort(9999)).toBeNull();
    expect(lookupPort(70000)).toBeNull();
    expect(searchPorts("mail").length).toBeGreaterThan(0);
    expect(searchPorts("443")[0].service).toBe("HTTPS");
    expect(wellKnownRange(80)).toMatch(/Well-known/);
    expect(wellKnownRange(8080)).toMatch(/Registered/);
    expect(wellKnownRange(50000)).toMatch(/Dynamic/);
  });
});

describe("http status", () => {
  it("lookup + search", () => {
    expect(lookupStatus(404)?.phrase).toBe("Not Found");
    expect(lookupStatus(99)).toBeNull();
    expect(searchStatuses("redirect").length).toBeGreaterThan(0);
    expect(searchStatuses("404")[0].phrase).toBe("Not Found");
  });
});
