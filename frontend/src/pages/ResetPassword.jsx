import { useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Enter your email address."); return; }
    setLoading(true);
    try {
      await fetch(`${API}/auth/password-reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Could not connect to the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow p-10 max-w-md w-full text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
          <p className="text-gray-600">
            If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-10 max-w-md w-full">
        <h2 className="text-xl font-bold mb-1">Reset password</h2>
        <p className="text-gray-500 text-sm mb-5">
          Enter your account email and we'll send you a reset link.
        </p>

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="input input-bordered w-full mb-4"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </div>
  );
}