import { NextRequest } from "next/server";
import net from "node:net";
import { cymruLookup } from "@/lib/intel";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = (req.nextUrl.searchParams.get("ip") ?? "").trim();
  if (net.isIP(ip) === 0) {
    return Response.json({ error: "Invalid IP address. Enter IPv4 or IPv6." }, { status: 400 });
  }
  try {
    const info = await cymruLookup(ip);
    if (!info) return Response.json({ error: `No ASN record for ${ip}. Private/reserved IPs have none.` }, { status: 404 });
    return Response.json({ ok: true, ip, ...info, source: "Team Cymru (DNS)" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ASN lookup failed.";
    if (/ENOTFOUND|ENODATA/.test(msg))
      return Response.json({ error: `No ASN record for ${ip}. Private/reserved IPs have none.` }, { status: 404 });
    return Response.json({ error: `ASN lookup failed: ${msg.slice(0, 200)}` }, { status: 502 });
  }
}
