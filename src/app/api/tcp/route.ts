import { NextRequest } from "next/server";
import net from "node:net";
import { assertPublicHost, validLookupName } from "@/lib/dns";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function GET(req: NextRequest) {
  const host = (req.nextUrl.searchParams.get("host") ?? "").trim();
  const portRaw = (req.nextUrl.searchParams.get("port") ?? "").trim();
  const port = Number(portRaw);

  if (!validLookupName(host)) {
    return Response.json({ error: "Invalid host. Use a hostname or IP, e.g. example.com." }, { status: 400 });
  }
  if (!portRaw || !Number.isInteger(port) || port < 1 || port > 65535) {
    return Response.json({ error: "Invalid port. Use 1-65535, e.g. 443." }, { status: 400 });
  }

  try {
    await assertPublicHost(host);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Blocked target." }, { status: 403 });
  }

  const t0 = Date.now();
  const result = await new Promise<{ ok: boolean; elapsedMs: number }>((resolve) => {
    const sock = net.connect({ host, port, timeout: 4000 }, () => {
      const elapsed = Date.now() - t0;
      sock.destroy();
      resolve({ ok: true, elapsedMs: elapsed });
    });
    sock.on("timeout", () => {
      sock.destroy();
      resolve({ ok: false, elapsedMs: Date.now() - t0 });
    });
    sock.on("error", () => {
      resolve({ ok: false, elapsedMs: Date.now() - t0 });
    });
  });

  if (result.ok) {
    return Response.json({ ok: true, host, port, elapsedMs: result.elapsedMs });
  }
  return Response.json(
    { error: `TCP connect to ${host}:${port} failed or timed out. Port may be closed or firewalled.` },
    { status: 502 }
  );
}
