import { describe, it, expect } from "vitest";
import {
  ciscoWildcard, buildAcl, parseAclAddr, vlanInfo, ciscoSubnet, ciscoIp,
  interfaceRange, buildConfig, ospfCost, eigrpMetric, stpEffectivePriority, stpWinner,
} from "@/lib/cisco";

describe("cisco", () => {
  it("wildcard + subnet commands", () => {
    const w = ciscoWildcard("192.168.1.0", 24)!;
    expect(w.wildcard).toBe("0.0.0.255");
    expect(w.networkStatement).toBe("network 192.168.1.0 0.0.0.255 area 0");
    const s = ciscoSubnet("192.168.1.130", 25)!;
    expect(s.ipCommand).toBe("ip address 192.168.1.129 255.255.255.128");
    expect(ciscoWildcard("nope", 24)).toBeNull();
  });
  it("acl build + addr parse", () => {
    expect(parseAclAddr("any")).toBe("any");
    expect(parseAclAddr("host 10.0.0.1")).toBe("host 10.0.0.1");
    expect(parseAclAddr("10.0.0.0 0.0.0.255")).toBe("10.0.0.0 0.0.0.255");
    expect(parseAclAddr("bogus")).toBeNull();
    const ok = buildAcl(100, [{ action: "permit", protocol: "tcp", src: "any", dst: "host 10.0.0.5", port: "eq 80", remark: "" }]);
    expect("lines" in ok && ok.lines[0]).toBe("access-list 100 permit tcp any host 10.0.0.5 eq 80");
    expect("error" in buildAcl(50, []) && true).toBe(true);
  });
  it("vlan kinds", () => {
    expect(vlanInfo(10, "MGMT")!.kind).toBe("normal");
    expect(vlanInfo(1003, "")!.kind).toBe("reserved-fddi-token");
    expect(vlanInfo(2000, "")!.kind).toBe("extended");
    expect(vlanInfo(5000, "")).toBeNull();
  });
  it("ip class + interface range + config", () => {
    expect(ciscoIp("10.1.2.3")!.cls).toBe("A");
    expect(ciscoIp("224.0.0.1")!.defaultMask).toBeNull();
    expect(interfaceRange("GigabitEthernet", 0, 1, 24)).toBe("interface range GigabitEthernet0/1 - 24");
    expect(interfaceRange("GigabitEthernet", 0, 24, 1)).toBeNull();
    const cfg = buildConfig("R1", [{ name: "GigabitEthernet0/0", ip: "192.168.1.1", mask: "255.255.255.0", desc: "LAN" }], "192.168.1.254");
    expect("config" in cfg && cfg.config).toContain("ip route 0.0.0.0 0.0.0.0 192.168.1.254");
    expect("error" in buildConfig("", [], "") && true).toBe(true);
  });
  it("ospf + eigrp + stp", () => {
    expect(ospfCost(100e6)).toBe(1);
    expect(ospfCost(10e6)).toBe(10);
    expect(ospfCost(1e12)).toBe(1); // min 1
    const e = eigrpMetric(1544, 20000)!;
    expect(e.metric).toBe(e.bwTerm + e.delayTerm);
    expect(eigrpMetric(1544, 20000, 1, 0, 1, 0, 1)).toBeNull(); // K5 unsupported
    expect(stpEffectivePriority(32768, 1)).toBe(32769);
    expect(stpEffectivePriority(100, 1)).toBeNull();
    expect(stpWinner(
      { priority: 32768, vlan: 1, mac: "00:11:22:33:44:55" },
      { priority: 28672, vlan: 1, mac: "00:11:22:33:44:66" }
    )).toMatch(/Bridge B wins/);
  });
});
