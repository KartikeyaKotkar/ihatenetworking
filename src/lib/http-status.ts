export interface HttpStatus {
  code: number;
  phrase: string;
  category: string;
  description: string;
}

const STATUSES: HttpStatus[] = [
  { code: 100, phrase: "Continue", category: "1xx Informational", description: "Server received headers, client should send body." },
  { code: 101, phrase: "Switching Protocols", category: "1xx Informational", description: "Server agrees to switch protocol, e.g. to WebSocket." },
  { code: 103, phrase: "Early Hints", category: "1xx Informational", description: "Preliminary headers while final response prepares." },
  { code: 200, phrase: "OK", category: "2xx Success", description: "Request succeeded. Standard GET/POST response." },
  { code: 201, phrase: "Created", category: "2xx Success", description: "New resource created, often after POST." },
  { code: 202, phrase: "Accepted", category: "2xx Success", description: "Accepted for async processing, not done yet." },
  { code: 203, phrase: "Non-Authoritative Information", category: "2xx Success", description: "Success via transforming proxy, metadata modified." },
  { code: 204, phrase: "No Content", category: "2xx Success", description: "Success with empty body, common for DELETE." },
  { code: 205, phrase: "Reset Content", category: "2xx Success", description: "Success, client should reset form view." },
  { code: 206, phrase: "Partial Content", category: "2xx Success", description: "Partial body per Range request, resume/downloads." },
  { code: 301, phrase: "Moved Permanently", category: "3xx Redirection", description: "URL moved for good. Update bookmarks, SEO passes rank." },
  { code: 302, phrase: "Found", category: "3xx Redirection", description: "Temporary redirect, historically rewrites POST to GET." },
  { code: 303, phrase: "See Other", category: "3xx Redirection", description: "Redirect to different resource via GET." },
  { code: 304, phrase: "Not Modified", category: "3xx Redirection", description: "Cached copy still fresh, no body sent." },
  { code: 307, phrase: "Temporary Redirect", category: "3xx Redirection", description: "Temporary move, method and body preserved." },
  { code: 308, phrase: "Permanent Redirect", category: "3xx Redirection", description: "Permanent move, method and body preserved." },
  { code: 400, phrase: "Bad Request", category: "4xx Client Error", description: "Malformed syntax or invalid parameters." },
  { code: 401, phrase: "Unauthorized", category: "4xx Client Error", description: "Missing or invalid authentication credentials." },
  { code: 403, phrase: "Forbidden", category: "4xx Client Error", description: "Authenticated but not allowed. No point retrying." },
  { code: 404, phrase: "Not Found", category: "4xx Client Error", description: "No resource at this path." },
  { code: 405, phrase: "Method Not Allowed", category: "4xx Client Error", description: "Method not supported here, see Allow header." },
  { code: 408, phrase: "Request Timeout", category: "4xx Client Error", description: "Server timed out waiting for request." },
  { code: 409, phrase: "Conflict", category: "4xx Client Error", description: "State conflict, e.g. duplicate unique key." },
  { code: 410, phrase: "Gone", category: "4xx Client Error", description: "Permanently deleted, stronger than 404." },
  { code: 413, phrase: "Content Too Large", category: "4xx Client Error", description: "Payload exceeds server limits." },
  { code: 415, phrase: "Unsupported Media Type", category: "4xx Client Error", description: "Wrong Content-Type for this endpoint." },
  { code: 418, phrase: "I'm a Teapot", category: "4xx Client Error", description: "Easter egg from HTCPCP coffee protocol." },
  { code: 422, phrase: "Unprocessable Content", category: "4xx Client Error", description: "Valid syntax, semantic validation failed." },
  { code: 425, phrase: "Too Early", category: "4xx Client Error", description: "Server refuses early-data replay risk." },
  { code: 429, phrase: "Too Many Requests", category: "4xx Client Error", description: "Rate limited. Back off per Retry-After." },
  { code: 451, phrase: "Unavailable For Legal Reasons", category: "4xx Client Error", description: "Blocked by law, e.g. censorship order." },
  { code: 500, phrase: "Internal Server Error", category: "5xx Server Error", description: "Generic server crash, check server logs." },
  { code: 501, phrase: "Not Implemented", category: "5xx Server Error", description: "Method not supported by server at all." },
  { code: 502, phrase: "Bad Gateway", category: "5xx Server Error", description: "Upstream/proxy got invalid response." },
  { code: 503, phrase: "Service Unavailable", category: "5xx Server Error", description: "Overloaded or down for maintenance." },
  { code: 504, phrase: "Gateway Timeout", category: "5xx Server Error", description: "Upstream did not answer in time." },
];

const byCode = new Map(STATUSES.map((s) => [s.code, s]));

export function lookupStatus(code: number): HttpStatus | null {
  if (!Number.isInteger(code) || code < 100 || code > 599) return null;
  return byCode.get(code) ?? null;
}

export function searchStatuses(query: string, limit = 20): HttpStatus[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  if (/^\d+$/.test(q)) {
    const hit = byCode.get(Number(q));
    return hit ? [hit] : [];
  }
  return STATUSES.filter(
    (s) => s.phrase.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  ).slice(0, limit);
}
