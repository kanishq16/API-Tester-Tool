import { useState } from "react";
import Tabs from "./Tabs.jsx";
import { fmtSize } from "../utils.js";

export default function ResponseViewer({ res, loading }) {
  const [tab, setTab] = useState("Body");

  return (
    <div className="card">
      <div className="meta">
        {loading && <span>Waiting for response…</span>}
        {!loading && !res && <span>Send a request to see the response.</span>}
        {!loading && res?.ok && (
          <>
            <span>
              Status{" "}
              <b className={`s${String(res.status)[0]}`}>
                {res.status} {res.statusText}
              </b>
            </span>
            <span>Time <b>{res.ms} ms</b></span>
            <span>Size <b>{fmtSize(res.size)}</b></span>
          </>
        )}
        {!loading && res && !res.ok && (
          <span>Status <b className="serr">Request failed</b></span>
        )}
      </div>

      {!loading && res && (
        <>
          <Tabs tabs={["Body", "Headers"]} value={tab} onChange={setTab} />
          {tab === "Body" && <pre>{res.body}</pre>}
          {tab === "Headers" && (
            <table>
              <tbody>
                {(res.headers || []).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
