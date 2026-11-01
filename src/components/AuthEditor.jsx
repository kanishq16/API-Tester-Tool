export default function AuthEditor({ auth, onChange }) {
  const set = (patch) => onChange({ ...auth, ...patch });

  return (
    <div className="bar">
      <select value={auth.type} onChange={(e) => set({ type: e.target.value })}>
        <option value="">None</option>
        <option value="bearer">Bearer token</option>
        <option value="basic">Basic auth</option>
      </select>
      {auth.type && (
        <input
          className="grow"
          placeholder={auth.type === "basic" ? "Username" : "Token"}
          value={auth.a}
          onChange={(e) => set({ a: e.target.value })}
        />
      )}