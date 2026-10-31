export const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export const fmtSize = (n) =>
  n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;

export function buildRequest({ method, url, headers, body, auth }) {
  const hs = {};
  headers.forEach((r) => {
    if (r.k.trim()) hs[r.k.trim()] = r.v;
  });
  if (auth.type === "bearer") hs["Authorization"] = `Bearer ${auth.a}`;
  if (auth.type === "basic") hs["Authorization"] = `Basic ${btoa(`${auth.a}:${auth.b}`)}`;

  const hasBody = body && !["GET", "HEAD"].includes(method);
  if (hasBody && !Object.keys(hs).some((k) => k.toLowerCase() === "content-type")) {
    hs["Content-Type"] = "application/json";
  }
  return { method, url: url.trim(), headers: hs, body: hasBody ? body : undefined };
}
export function toCurl(q) {
  const esc = (s) => "'" + String(s).replace(/'/g, "'\\''") + "'";
  let c = `curl -X ${q.method} ${esc(q.url)}`;
  for (const k in q.headers) c += ` \\\n  -H ${esc(`${k}: ${q.headers[k]}`)}`;
  if (q.body) c += ` \\\n  -d ${esc(q.body)}`;
  return c;
}

const KEY = "api-tester-history";

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistory(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable */
  }
}
