import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = "http://127.0.0.1:8000/api";

export default function ResetPasswordConfirm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const uid = params.get("uid");
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/password-reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, new_password: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        setTimeout(() => navigate("/auth"), 2500);
      } else {
        setError(data.detail || "Reset failed. The link may have expired.");
      }
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Invalid reset link.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2">Password updated</h2>
          <p className="text-gray-600">Redirecting you to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-10 max-w-md w-full">
        <h2 className="text-xl font-bold mb-5">Set new password</h2>

        <label className="block text-sm mb-1">New password</label>
        <input
          type="password"
          className="input input-bordered w-full mb-3"
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="block text-sm mb-1">Confirm password</label>
        <input
          type="password"
          className="input input-bordered w-full mb-4"
          placeholder="Repeat password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Saving…" : "Reset password"}
        </button>
      </form>
    </div>
  );
}