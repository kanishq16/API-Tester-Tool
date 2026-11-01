export default function HeadersEditor({ headers, onChange }) {
  const update = (i, key, val) =>
    onChange(headers.map((r, j) => (j === i ? { ...r, [key]: val } : r)));

  return (
    <div>
      {headers.map((r, i) => (
        <div className="row" key={i}>
          <input
            placeholder="Header name"
            value={r.k}
            onChange={(e) => update(i, "k", e.target.value)}
          />
          <input
            placeholder="Value"
            value={r.v}
            onChange={(e) => update(i, "v", e.target.value)}
          />
          <button title="Remove" onClick={() => onChange(headers.filter((_, j) => j !== i))}>
            ✕
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...headers, { k: "", v: "" }])}>+ Add header</button>
    </div>
  );
}
