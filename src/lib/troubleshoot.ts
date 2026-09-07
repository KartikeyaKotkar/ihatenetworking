// Pure troubleshoot model — no I/O, no fetch, no node:dns.
// TOOLS = individual utilities; TROUBLESHOOT = ordered investigations.

export type StepId = "dns" | "reachability" | "tcp443" | "http" | "tls";
export type StepState = "idle" | "running" | "passed" | "failed" | "skipped" | "unable";

export interface TroubleshootStep {
  id: StepId;
  title: string;
  description: string;
}

export const UNREACHABLE_STEPS: TroubleshootStep[] = [
  { id: "dns", title: "DNS resolution", description: "Can the hostname be resolved to an IP?" },
  { id: "reachability", title: "Reachability", description: "Is the host responding to ping / TCP?" },
  { id: "tcp443", title: "TCP port 443", description: "Is HTTPS port open?" },
  { id: "http", title: "HTTP response", description: "Does the server return an HTTP status?" },
  { id: "tls", title: "TLS", description: "Is the certificate valid for HTTPS?" },
];

export interface Scenario {
  id: string;
  href: string;
  title: string;
  description: string;
  steps: TroubleshootStep[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "unreachable",
    href: "/troubleshoot/unreachable",
    title: "Website / server unreachable",
    description: "Walk through the network path from DNS to HTTP and find where things are breaking.",
    steps: UNREACHABLE_STEPS,
  },
];

/**
 * Extract hostname from raw input.
 * Accepts: example.com, https://example.com/path?x=1, http://example.com:8080, 8.8.8.8
 * Returns lowercase hostname without port/path, or null if invalid.
 */
export function parseHostname(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  // Reject strings with spaces
  if (/\s/.test(s)) return null;

  let candidate = s;

  // If it looks like a URL with scheme, use URL parser
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) {
    // Reject non-http(s) schemes
    if (!/^https?:\/\//i.test(s)) return null;
    try {
      const u = new URL(s);
      candidate = u.hostname;
    } catch {
      return null;
    }
  } else {
    // Bare hostname: strip path/query/fragment/port manually
    // Take up to first / ? # 
    candidate = s.split("/")[0].split("?")[0].split("#")[0];
    // Strip port if present (but keep IPv6 brackets)
    if (candidate.startsWith("[")) {
      const close = candidate.indexOf("]");
      if (close === -1) return null;
      candidate = candidate.slice(1, close);
    } else if (candidate.includes(":")) {
      // Could be host:port or bare IPv6 — check if it's an IP with colons
      // For IPv6 without brackets, treat whole string as host candidate and validate later via regex
      // For host:port, split on last colon only if not IPv6
      const parts = candidate.split(":");
      // If 2 parts and second is numeric port, strip port
      if (parts.length === 2 && /^\d+$/.test(parts[1])) {
        candidate = parts[0];
      } else if (parts.length > 2) {
        // Looks like raw IPv6 without brackets — keep as-is
      }
    }
  }

  candidate = candidate.replace(/\.$/, "").toLowerCase();
  if (!candidate) return null;
  if (candidate.length > 253) return null;

  // Allow IP literals: quick check via regex rather than net.isIP (client-safe)
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(candidate)) {
    const octets = candidate.split(".").map(Number);
    if (octets.some((n) => n < 0 || n > 255)) return null;
    return candidate;
  }
  if (/^[0-9a-f:]+$/i.test(candidate) && candidate.includes(":")) {
    // Loose IPv6 check: contains colon and hex/colons only, not failing fast is ok
    // Accept as-is; server will validate stricter
    if (candidate.length <= 45) return candidate;
  }

  // Hostname validation: mirrors validLookupName client-side safe
  if (!/^[a-z0-9.-]+$/.test(candidate)) return null;
  if (candidate.includes("..")) return null;
  const labels = candidate.split(".");
  // Single label allowed (e.g. localhost)
  if (labels.length < 2) {
    if (!/^[a-z0-9-]+$/.test(candidate)) return null;
    if (candidate.startsWith("-") || candidate.endsWith("-")) return null;
    return candidate;
  }
  for (const l of labels) {
    if (l.length === 0 || l.length > 63) return null;
    if (l.startsWith("-") || l.endsWith("-")) return null;
  }
  return candidate;
}

export interface DiagnosisInput {
  dns: StepState;
  reachability: StepState;
  tcp443: StepState;
  http: StepState;
  tls: StepState;
}

export interface Diagnosis {
  summary: string;
  likelyCause: string;
  checks: { id: StepId; label: string; state: StepState }[];
  nextSteps: string[];
}

/**
 * Derive diagnosis from only the checks actually performed.
 * Never claim certainty when evidence is incomplete — uses "Most likely".
 */
export function deriveDiagnosis(input: DiagnosisInput): Diagnosis {
  const { dns, reachability, tcp443, http, tls } = input;

  const checks: Diagnosis["checks"] = [
    { id: "dns", label: "DNS", state: dns },
    { id: "reachability", label: "Reachable", state: reachability },
    { id: "tcp443", label: "TCP 443", state: tcp443 },
    { id: "http", label: "HTTP", state: http },
    { id: "tls", label: "TLS", state: tls },
  ];

  const isIncomplete = Object.values(input).some((s) => s === "idle" || s === "running" || s === "unable");
  const hasFailed = Object.values(input).some((s) => s === "failed");

  // All passed
  if (dns === "passed" && reachability === "passed" && tcp443 === "passed" && http === "passed" && tls === "passed") {
    return {
      summary: "All checks passed — the site appears reachable.",
      likelyCause: "No failure detected from this network path. If the site still fails for you, it may be a client-side, caching, or geographic issue.",
      checks,
      nextSteps: ["Try a hard refresh and clear cache.", "Check from another network or device.", "Inspect browser console for client errors."],
    };
  }

  // Incomplete
  if (isIncomplete && !hasFailed) {
    return {
      summary: "Investigation incomplete.",
      likelyCause: "Not enough checks have completed to determine the cause. Run the remaining steps.",
      checks,
      nextSteps: ["Complete the remaining checks.", "Check DNS records if DNS did not resolve."],
    };
  }

  if (dns === "failed") {
    return {
      summary: "DNS resolution failed.",
      likelyCause: "Most likely issue: the hostname does not resolve. Missing DNS record, delegation/propagation problem, or typo.",
      checks,
      nextSteps: ["Verify spelling of the hostname.", "Check the domain's A/AAAA and NS records.", "Check DNS propagation if recently changed."],
    };
  }

  if (dns === "passed" && reachability === "failed") {
    return {
      summary: "Host resolves but is not reachable.",
      likelyCause: "Most likely issue: host is down, network unreachable, or ICMP/TCP blocked by firewall.",
      checks,
      nextSteps: ["Check if the server is powered on and network-connected.", "Review firewall/security groups.", "Try traceroute to see where packets stop."],
    };
  }

  if (reachability === "passed" && tcp443 === "failed") {
    return {
      summary: "Host is reachable but TCP port 443 is closed.",
      likelyCause: "Most likely issue: HTTPS port 443 is not accepting connections. Service not listening, firewall, or proxy misconfiguration.",
      checks,
      nextSteps: ["Check firewall/security group allows 443.", "Verify service is listening on 443.", "Check reverse proxy / load balancer."],
    };
  }

  if (tcp443 === "passed" && http === "failed") {
    return {
      summary: "TCP 443 open but HTTP request failed.",
      likelyCause: "Most likely issue: service on 443 is not speaking HTTP correctly — timeout, reset, or 5xx error.",
      checks,
      nextSteps: ["Check server logs for crashes or overload.", "Verify reverse proxy is forwarding to the app.", "Try HTTP header check for the exact status/error."],
    };
  }

  if (http === "passed" && tls === "failed") {
    return {
      summary: "HTTP succeeded but TLS check failed.",
      likelyCause: "Most likely issue: TLS certificate problem — expired, wrong hostname, or untrusted chain.",
      checks,
      nextSteps: ["Check certificate expiry and SAN.", "Verify the certificate matches the hostname.", "Check intermediate chain is complete."],
    };
  }

  // Generic failed fallback
  if (hasFailed) {
    const firstFailed = checks.find((c) => c.state === "failed");
    return {
      summary: `Check failed at ${firstFailed?.label ?? "unknown step"}.`,
      likelyCause: `Most likely issue is near ${firstFailed?.label ?? "the failing step"}. Review that layer and the suggestions in each step.`,
      checks,
      nextSteps: ["Follow the 'What to do next' for the failing step above.", "Retry after fixing the flagged layer."],
    };
  }

  // Idle/skipped heavy
  return {
    summary: "Investigation incomplete.",
    likelyCause: "Run all checks to get a diagnosis.",
    checks,
    nextSteps: ["Start the investigation with a hostname."],
  };
}
