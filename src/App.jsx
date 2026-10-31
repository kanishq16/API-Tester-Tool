import { useEffect, useState } from "react";
import Tabs from "./components/Tabs.jsx";
import HeadersEditor from "./components/HeadersEditor.jsx";
import AuthEditor from "./components/AuthEditor.jsx";
import ResponseViewer from "./components/ResponseViewer.jsx";
import History from "./components/History.jsx";
import { METHODS, buildRequest, toCurl, loadHistory, saveHistory } from "./utils.js";

export default function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState([{ k: "Accept", v: "application/json" }]);
  const [body, setBody] = useState("");
  const [auth, setAuth] = useState({ type: "", a: "", b: "" });
  const [reqTab, setReqTab] = useState("Headers");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [curlLabel, setCurlLabel] = useState("Copy as cURL");
  //

  useEffect(() => saveHistory(history), [history]);

  const current = () => buildRequest({ method, url, headers, body, auth });

  async function send() {
    const q = current();
    if (!q.url) return;
    setLoading(true);
    setRes(null);
    const t0 = performance.now();
    try {
      const r = await fetch(q.url, { method: q.method, headers: q.headers, body: q.body });
      const text = await r.text();
      let shown = text;
      try {
        shown = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* not JSON */
      }
      setRes({
        ok: true,
        status: r.status,
        statusText: r.statusText,
        ms: Math.round(performance.now() - t0),
        size: new Blob([text]).size,
        body: shown || "(empty body)",
        headers: [...r.headers.entries()],
      });
      setHistory((h) =>
        [{ method: q.method, url: q.url }, ...h.filter((x) => !(x.method === q.method && x.url === q.url))].slice(0, 10)
      );
    } catch (err) {
      setRes({
        ok: false,
        body:
          `${err.message || err}\n\nCommon causes: the server doesn’t allow cross-origin ` +
          `requests (CORS), or the URL is wrong or unreachable.`,
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyCurl() {
    const text = toCurl(current());
    try {
      await navigator.clipboard.writeText(text);
      setCurlLabel("Copied ✓");
    } catch {
      setRes({ ok: false, body: text });
      setCurlLabel("Shown below");
    }
    setTimeout(() => setCurlLabel("Copy as cURL"), 1500);
  }

  return (
    <div className="wrap">
      <h1>API Tester</h1>

      <div className="card">
        <div className="bar">
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input
            className="grow"
            value={url}
            spellCheck={false}
            placeholder="https://api.example.com/endpoint"
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="primary" disabled={loading} onClick={send}>
            {loading ? "Sending…" : "Send"}
          </button>
        </div>

        <Tabs tabs={["Headers", "Body", "Auth"]} value={reqTab} onChange={setReqTab} />

        {reqTab === "Headers" && <HeadersEditor headers={headers} onChange={setHeaders} />}
        {reqTab === "Body" && (
          <div>
            <textarea
              value={body}
              spellCheck={false}
              placeholder='{"title":"hello"}'
              onChange={(e) => setBody(e.target.value)}
            />
            <p className="hint">
              Sent for POST, PUT, PATCH and DELETE. Content-Type defaults to application/json if you don’t set one.
            </p>
          </div>
        )}
        {reqTab === "Auth" && <AuthEditor auth={auth} onChange={setAuth} />}

        <div className="bar" style={{ marginTop: 10 }}>
          <button onClick={copyCurl}>{curlLabel}</button>
        </div>
      </div>

      <ResponseViewer res={res} loading={loading} />
      <History items={history} onPick={(h) => { setMethod(h.method); setUrl(h.url); }} />
    </div>
  );
}
