import { NextRequest } from "next/server";
import net from "node:net";
import { reverseLookup } from "@/lib/dns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = (req.nextUrl.searchParams.get("ip") ?? "").trim();
  if (net.isIP(ip) === 0) {
    return Response.json({ error: "Invalid IP address. Enter IPv4 or IPv6." }, { status: 400 });
  }
  try {
    const hostnames = await reverseLookup(ip);
    return Response.json({ ok: true, ip, hostnames });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Reverse lookup failed.";
    if (/ENOTFOUND|ENODATA/i.test(msg)) {
      return Response.json({ error: `No PTR record for ${ip}. Many IPs have none; that is normal.` }, { status: 404 });
    }
    return Response.json({ error: `Reverse lookup failed: ${msg}` }, { status: 502 });
  }
}
