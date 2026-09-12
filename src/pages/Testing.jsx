import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUserVerify,
  deleteUser,
} from "../services/testingService";

export default function Testing() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 READ
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await getAllUsers();

    if (error) setError(error);
    else setUsers(data);

    setLoading(false);
  };

  // ➕ CREATE
  const handleAddUser = async () => {
    if (!form.name.trim()) return alert("Nama tidak boleh kosong!");
    if (!form.email.trim()) return alert("Email tidak boleh kosong!");

    setError(null);
    const { data, error } = await createUser(form);

    if (error) {
      setError(error);
    } else {
      setUsers([data, ...users]);
      setForm({ name: "", email: "", phone: "" });
    }
  };

  // 🔄 UPDATE
  const handleToggleVerify = async (id, current) => {
    const { data, error } = await updateUserVerify(id, current);

    if (error) setError(error);
    else setUsers(users.map((u) => (u.id === id ? data : u)));
  };

  // 🗑️ DELETE
  const handleDeleteUser = async (id) => {
    if (!confirm("Yakin hapus user ini?")) return;

    const { error } = await deleteUser(id);

    if (error) setError(error);
    else setUsers(users.filter((u) => u.id !== id));
  };

  // 🚀 Fetch saat mount (anti-warning React)
  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      const { data, error } = await getAllUsers();

      if (ignore) return;

      if (error) setError(error);
      else setUsers(data);

      setLoading(false);
    })();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: 900,
        margin: "auto",
      }}
    >
      <h1>🧪 Testing — CRUD users_tb</h1>
      <p style={{ color: "#666", fontSize: "0.9rem" }}>
        Halaman ini untuk testing koneksi Supabase & operasi CRUD.
      </p>

      {/* FORM */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          margin: "1rem 0",
        }}
      >
        <input
          type="text"
          placeholder="Nama *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ padding: "0.5rem", width: 180 }}
        />
        <input
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ padding: "0.5rem", width: 220 }}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={{ padding: "0.5rem", width: 160 }}
        />
        <button onClick={handleAddUser} style={{ padding: "0.5rem 1rem" }}>
          ➕ Add User
        </button>
        <button onClick={fetchUsers} style={{ padding: "0.5rem 1rem" }}>
          🔄 Refresh
        </button>
      </div>

      {/* ERROR & LOADING */}
      {error && <p style={{ color: "red" }}>❌ Error: {error}</p>}
      {loading && <p>⏳ Loading...</p>}

      {/* TABLE */}
      <h2>Daftar User ({users.length})</h2>
      {!loading && users.length === 0 && <p>Belum ada user.</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nama</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={tdStyle}>{u.id}</td>
              <td style={tdStyle}>{u.name}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.phone || "—"}</td>
              <td style={tdStyle}>
                <span
                  onClick={() => handleToggleVerify(u.id, u.is_verified)}
                  style={{
                    cursor: "pointer",
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontSize: "0.8rem",
                    background: u.is_verified ? "#dcfce7" : "#fee2e2",
                    color: u.is_verified ? "#166534" : "#991b1b",
                  }}
                >
                  {u.is_verified ? "✅ Verified" : "⏳ Unverified"}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "0.3rem 0.7rem",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  🗑️ Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#666" }}>
        ⚠️ <strong>Catatan:</strong> Kolom <code>password_hash</code> sengaja
        tidak di-select untuk keamanan. Nanti saat produksi, gunakan{" "}
        <strong>Supabase Auth</strong>.
      </p>
    </div>
  );
}

// Inline styles
const thStyle = { padding: "0.6rem", borderBottom: "2px solid #d1d5db" };
const tdStyle = { padding: "0.6rem" };
