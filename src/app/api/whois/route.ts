import { NextRequest } from "next/server";
import { whoisLookup } from "@/lib/intel";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length === 0 || q.length > 253) {
    return Response.json({ error: "Enter a domain (example.com) or IP address." }, { status: 400 });
  }
  try {
    const out = await whoisLookup(q);
    if (!out.raw) return Response.json({ error: `Empty WHOIS response for ${q}.` }, { status: 502 });
    return Response.json({ ok: true, query: q, ...out });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message.slice(0, 300) : "WHOIS failed." }, { status: 502 });
  }
}
