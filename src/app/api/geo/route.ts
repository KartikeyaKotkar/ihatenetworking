import { NextRequest } from "next/server";
import net from "node:net";
import { geoLookup } from "@/lib/intel";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = (req.nextUrl.searchParams.get("ip") ?? "").trim();
  if (net.isIP(ip) === 0) {
    return Response.json({ error: "Invalid IP address. Enter IPv4 or IPv6." }, { status: 400 });
  }
  try {
    const geo = await geoLookup(ip);
    return Response.json({ ok: true, ...geo, note: "City-level accuracy only. VPNs/proxies report exit-node location." });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message.slice(0, 300) : "Geo lookup failed." }, { status: 502 });
  }
}
