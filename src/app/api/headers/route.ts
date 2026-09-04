import { NextRequest } from "next/server";
import { assertPublicHost, validHttpUrl } from "@/lib/dns";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const raw = (req.nextUrl.searchParams.get("url") ?? "").trim();
  const target = validHttpUrl(raw);
  if (!target) {
    return Response.json({ error: "Invalid URL. Use http(s)://host/path, e.g. https://example.com." }, { status: 400 });
  }
  try {
    await assertPublicHost(target.hostname);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Blocked target." }, { status: 403 });
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  const started = Date.now();
  try {
    const res = await fetch(target.toString(), {
      method: "GET",
      redirect: "manual",
      signal: ctrl.signal,
      headers: { "User-Agent": "didyoupingit-header-check/1.0" },
    });
    const elapsedMs = Date.now() - started;
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k] = v;
    });
    return Response.json({
      ok: true,
      url: target.toString(),
      status: res.status,
      statusText: res.statusText,
      elapsedMs,
      redirected: res.status >= 300 && res.status < 400,
      location: res.headers.get("location"),
      headers,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Fetch failed.";
    if (/abort/i.test(msg)) return Response.json({ error: "Timed out after 12s. Host may be down or blocking." }, { status: 504 });
    return Response.json({ error: `Fetch failed: ${msg}` }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
