import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.username.trim()) return "Username is required.";
    if (form.username.trim().length < 3) return "Username must be at least 3 characters.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/auth", { state: { registered: true } });
      } else {
        const first = Object.values(data)[0];
        setError(Array.isArray(first) ? first[0] : String(first));
      }
    } catch {
      setError("Could not connect to the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-xl mb-4 font-bold">Sign Up</h2>

        <input
          name="username"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default Signup;