import { describe, it, expect } from "vitest";
import { parseHostname, deriveDiagnosis } from "@/lib/troubleshoot";

describe("parseHostname", () => {
  it("bare hostname", () => expect(parseHostname("example.com")).toBe("example.com"));
  it("https url", () => expect(parseHostname("https://example.com/path?q=1")).toBe("example.com"));
  it("http with port", () => expect(parseHostname("http://example.com:8080/foo")).toBe("example.com"));
  it("trims and lowercases", () => expect(parseHostname("  EXAMPLE.COM  ")).toBe("example.com"));
  it("rejects bad", () => expect(parseHostname("not a host")).toBeNull());
  it("rejects non-http scheme", () => expect(parseHostname("ftp://example.com")).toBeNull());
  it("ipv4", () => expect(parseHostname("8.8.8.8")).toBe("8.8.8.8"));
  it("ipv4 in url", () => expect(parseHostname("https://8.8.8.8/test")).toBe("8.8.8.8"));
  it("trailing dot", () => expect(parseHostname("example.com.")).toBe("example.com"));
  it("single label", () => expect(parseHostname("localhost")).toBe("localhost"));
});

describe("deriveDiagnosis", () => {
  it("dns failure", () => {
    const d = deriveDiagnosis({ dns: "failed", reachability: "skipped", tcp443: "skipped", http: "skipped", tls: "skipped" });
    expect(d.summary.toLowerCase()).toContain("dns");
    expect(d.likelyCause.toLowerCase()).toContain("dns");
  });

  it("dns success -> reachability failure", () => {
    const d = deriveDiagnosis({ dns: "passed", reachability: "failed", tcp443: "skipped", http: "skipped", tls: "skipped" });
    expect(d.likelyCause.toLowerCase()).toContain("reachable");
  });

  it("reach success -> tcp 443 failure", () => {
    const d = deriveDiagnosis({ dns: "passed", reachability: "passed", tcp443: "failed", http: "skipped", tls: "skipped" });
    expect(d.summary).toContain("443");
    expect(d.nextSteps.join(" ").toLowerCase()).toContain("firewall");
  });

  it("tcp success -> http failure", () => {
    const d = deriveDiagnosis({ dns: "passed", reachability: "passed", tcp443: "passed", http: "failed", tls: "skipped" });
    expect(d.summary.toLowerCase()).toContain("http");
  });

  it("http success -> tls failure", () => {
    const d = deriveDiagnosis({ dns: "passed", reachability: "passed", tcp443: "passed", http: "passed", tls: "failed" });
    expect(d.likelyCause.toLowerCase()).toContain("certificate");
  });

  it("completely successful", () => {
    const d = deriveDiagnosis({ dns: "passed", reachability: "passed", tcp443: "passed", http: "passed", tls: "passed" });
    expect(d.summary.toLowerCase()).toContain("all checks passed");
  });

  it("incomplete", () => {
    const d = deriveDiagnosis({ dns: "passed", reachability: "idle", tcp443: "idle", http: "idle", tls: "idle" });
    expect(d.summary.toLowerCase()).toContain("incomplete");
  });

  it("unable does not claim success", () => {
    const d = deriveDiagnosis({ dns: "passed", reachability: "unable", tcp443: "idle", http: "idle", tls: "idle" });
    expect(d.summary.toLowerCase()).toContain("incomplete");
  });
});
