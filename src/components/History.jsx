export default function History({ items, onPick }) {
  return (
    <div className="card">
      <b>History</b>
      <div className="hist">
        {items.length === 0 && <span className="hint">No requests yet.</span>}
        {items.map((h, i) => (
          <button key={i} onClick={() => onPick(h)}>
            {h.method} {h.url}
          </button>
        ))}
      </div>
    </div>
  );
}
