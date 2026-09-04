import { NextRequest } from "next/server";
import { isDnsType, resolveRecords, validLookupName, DNS_TYPES } from "@/lib/dns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const name = (req.nextUrl.searchParams.get("name") ?? "").trim();
  const typeRaw = (req.nextUrl.searchParams.get("type") ?? "A").toUpperCase();
  if (!validLookupName(name)) {
    return Response.json({ error: "Invalid hostname. Use letters, digits, dots, hyphens (e.g. example.com)." }, { status: 400 });
  }
  if (!isDnsType(typeRaw)) {
    return Response.json({ error: `Invalid type. Use one of: ${DNS_TYPES.join(", ")}.` }, { status: 400 });
  }
  try {
    const answer = await resolveRecords(name, typeRaw);
    return Response.json({ ok: true, answer });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lookup failed.";
    const status = /ENOTFOUND|ENODATA|ESERVFAIL/i.test(msg) ? 404 : 502;
    return Response.json({ error: readableDnsError(msg, name, typeRaw) }, { status });
  }
}

function readableDnsError(msg: string, name: string, type: string): string {
  if (/ENOTFOUND/i.test(msg)) return `No DNS answer: ${name} does not exist or has no ${type} record.`;
  if (/ENODATA/i.test(msg)) return `No ${type} record for ${name}. Host exists but lacks this record type.`;
  if (/ESERVFAIL|ETIMEDOUT|timed out/i.test(msg)) return `DNS server failed or timed out for ${name}. Try again.`;
  return `Lookup failed: ${msg}`;
}
