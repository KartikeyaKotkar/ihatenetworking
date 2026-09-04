import { describe, it, expect } from "vitest";
import { subnetQuestion, cidrQuestion, vlsmQuestion, wildcardQuestion, ipQuizQuestion, portQuizQuestion } from "@/lib/learn";

// Deterministic LCG for stable tests
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

describe("practice generators", () => {
  const gens = [subnetQuestion, cidrQuestion, vlsmQuestion, wildcardQuestion, ipQuizQuestion, portQuizQuestion];
  for (const g of gens) {
    it(`${g.name}: 4 unique options incl answer, 50 seeds`, () => {
      for (let seed = 1; seed <= 50; seed++) {
        const q = g(lcg(seed));
        expect(q.options.length).toBe(4);
        expect(new Set(q.options).size).toBe(4);
        expect(q.options).toContain(q.answer);
        expect(q.prompt.length).toBeGreaterThan(5);
      }
    });
  }
  it("vlsm answer actually fits", () => {
    const q = vlsmQuestion(lcg(7));
    expect(q.answer).toMatch(/^\/\d+$/);
  });
});
