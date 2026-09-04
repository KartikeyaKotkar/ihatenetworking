import { NextRequest } from "next/server";
import { execFile } from "node:child_process";
import { assertPublicHost, validLookupName } from "@/lib/dns";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function run(cmd: string, args: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout: timeoutMs, maxBuffer: 128 * 1024 }, (err, stdout, stderr) => {
      if (err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(new Error("BINARY_MISSING"));
        return;
      }
      const out = String(stdout).trim();
      if (!out) {
        reject(new Error((String(stderr) || err?.message || "Traceroute produced no output.").slice(0, 500)));
        return;
      }
      resolve(out);
    });
  });
}

export async function GET(req: NextRequest) {
  const host = (req.nextUrl.searchParams.get("host") ?? "").trim();
  const maxHopsRaw = req.nextUrl.searchParams.get("maxHops") ?? "20";
  const maxHops = Math.min(30, Math.max(2, Number(maxHopsRaw) || 20));
  if (!validLookupName(host)) {
    return Response.json({ error: "Invalid host. Use a hostname or IP, e.g. example.com." }, { status: 400 });
  }
  try {
    await assertPublicHost(host);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Blocked target." }, { status: 403 });
  }
  const errors: string[] = [];
  // Prefer traceroute, fall back to tracepath
  for (const [cmd, args] of [
    ["traceroute", ["-n", "-w", "2", "-q", "1", "-m", String(maxHops), host]],
    ["tracepath", ["-n", "-m", String(maxHops), host]],
  ] as const) {
    try {
      const raw = await run(cmd, [...args], 45000);
      return Response.json({ ok: true, host, method: cmd, raw });
    } catch (e) {
      errors.push(`${cmd}: ${e instanceof Error ? e.message : "failed"}`);
      if (e instanceof Error && e.message !== "BINARY_MISSING") break; // binary exists but target failed; stop
    }
  }
  if (errors.every((m) => m.includes("BINARY_MISSING"))) {
    return Response.json(
      { error: "Traceroute binary unavailable on this host. Run `traceroute HOST` or `tracert HOST` locally instead." },
      { status: 501 }
    );
  }
  return Response.json({ error: `Traceroute failed. ${errors.join(" ")}`.slice(0, 500) }, { status: 502 });
}
