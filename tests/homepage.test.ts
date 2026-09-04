import { describe, it, expect } from "vitest";
import { TOOLS, CATEGORIES, searchTools, toolsByCategory } from "@/lib/tools";

describe("tool index", () => {
  it("covers all 85 live routes", () => {
    expect(TOOLS.length).toBe(85);
    const hrefs = new Set(TOOLS.map((t) => t.href));
    for (const h of ["/subnet-calculator", "/traceroute", "/decimal-to-hex", "/dns-lookup", "/asn-lookup", "/tcp-header-decoder", "/bandwidth-calculator", "/whois-lookup"]) {
      expect(hrefs.has(h)).toBe(true);
    }
  });
  it("no duplicate hrefs, every tool in a real category", () => {
    const hrefs = TOOLS.map((t) => t.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const t of TOOLS) {
      expect(CATEGORIES.some((c) => c.id === t.category)).toBe(true);
    }
  });
  it("search finds by title, keyword, multi-word", () => {
    expect(searchTools("subnet")[0].href).toBe("/subnet-calculator");
    expect(searchTools("244").length).toBe(0);
    expect(searchTools("404").map((t) => t.href)).toContain("/http-status-code-lookup");
    expect(searchTools("mail server").map((t) => t.href)).toContain("/mx-record-lookup");
    expect(searchTools("x").length).toBe(0); // min length 2
    expect(searchTools("").length).toBe(0);
  });
  it("calculators + cisco sections non-empty", () => {
    expect(toolsByCategory("calculators").length).toBeGreaterThan(0);
    expect(toolsByCategory("cisco").length).toBe(10);
  });
});
