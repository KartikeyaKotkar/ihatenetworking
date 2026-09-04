import { NextRequest } from "next/server";
import { propagationCheck } from "@/lib/intel";
import { validLookupName } from "@/lib/dns";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const name = (req.nextUrl.searchParams.get("name") ?? "").trim();
  if (!validLookupName(name)) {
    return Response.json({ error: "Invalid hostname. Try example.com." }, { status: 400 });
  }
  try {
    const results = await propagationCheck(name);
    const sets = results.filter((r) => r.values).map((r) => r.values!.join(","));
    const agreed = sets.length > 0 && sets.every((s) => s === sets[0]);
    return Response.json({ ok: true, name, agreed, resolvers: results });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message.slice(0, 300) : "Propagation check failed." }, { status: 502 });
  }
}
