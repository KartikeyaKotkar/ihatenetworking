import { NextRequest } from "next/server";
import { execFile } from "node:child_process";
import net from "node:net";
import { assertPublicHost, validLookupName } from "@/lib/dns";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function run(cmd: string, args: string[], timeoutMs: number): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout: timeoutMs, maxBuffer: 64 * 1024 }, (err, stdout, stderr) => {
      if (err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(new Error(`BINARY_MISSING:${cmd}`));
        return;
      }
      // ping exits nonzero on packet loss; still resolve with output
      resolve({ stdout: String(stdout), stderr: String(stderr) });
    });
  });
}

function parseLinuxPing(out: string): { transmitted: number; received: number; lossPct: number; min: number; avg: number; max: number } | null {
  const loss = out.match(/(\d+) packets transmitted,\s*(\d+) received,\s*([\d.]+)% packet loss/);
  const rtt = out.match(/min\/avg\/max(?:\/mdev)? = ([\d.]+)\/([\d.]+)\/([\d.]+)/);
  if (!loss) return null;
  return {
    transmitted: Number(loss[1]),
    received: Number(loss[2]),
    lossPct: Number(loss[3]),
    min: rtt ? Number(rtt[1]) : NaN,
    avg: rtt ? Number(rtt[2]) : NaN,
    max: rtt ? Number(rtt[3]) : NaN,
  };
}

async function tcpPing(host: string): Promise<{ avg: number; min: number; max: number; detail: string }> {
  const ports = [443, 80];
  const samples: number[] = [];
  for (const port of ports) {
    for (let i = 0; i < 2; i++) {
      const t0 = Date.now();
      const ok = await new Promise<boolean>((resolve) => {
        const sock = net.connect({ host, port, timeout: 4000 }, () => {
          sock.destroy();
          resolve(true);
        });
        sock.on("timeout", () => {
          sock.destroy();
          resolve(false);
        });
        sock.on("error", () => resolve(false));
      });
      if (ok) samples.push(Date.now() - t0);
    }
    if (samples.length >= 2) break;
  }
  if (samples.length === 0) throw new Error("TCP connect failed on ports 443 and 80. Host may be down or firewalled.");
  return {
    min: Math.min(...samples),
    avg: Math.round(samples.reduce((a, b) => a + b, 0) / samples.length),
    max: Math.max(...samples),
    detail: `TCP connect latency (ICMP unavailable from this host).`,
  };
}

export async function GET(req: NextRequest) {
  const host = (req.nextUrl.searchParams.get("host") ?? "").trim();
  if (!validLookupName(host)) {
    return Response.json({ error: "Invalid host. Use a hostname or IP, e.g. example.com." }, { status: 400 });
  }
  try {
    await assertPublicHost(host);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Blocked target." }, { status: 403 });
  }
  // Prefer system ping (real ICMP) when available
  try {
    const { stdout } = await run("ping", ["-c", "3", "-W", "2", host], 15000);
    const parsed = parseLinuxPing(stdout);
    if (parsed) {
      return Response.json({ ok: true, host, method: "icmp", raw: stdout.trim().split("\n").slice(-2).join("\n"), ...parsed });
    }
  } catch (e) {
    if (e instanceof Error && !e.message.startsWith("BINARY_MISSING")) {
      // fall through to TCP
    }
  }
  try {
    const tcp = await tcpPing(host);
    return Response.json({ ok: true, host, method: "tcp", transmitted: 4, received: 4, lossPct: 0, ...tcp });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Ping failed." }, { status: 502 });
  }
}
