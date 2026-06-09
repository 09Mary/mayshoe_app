import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.username.trim())            return "Username is required.";
    if (form.username.trim().length < 3)  return "Username must be at least 3 characters.";
    if (!form.email.trim())               return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
    if (!form.password)                   return "Password is required.";
    if (form.password.length < 8)         return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (!res.ok) {
        const firstKey = Object.keys(data)[0];
        const firstVal = data[firstKey];
        setError(Array.isArray(firstVal) ? firstVal[0] : String(firstVal));
        return;
      }

      // Backend returns 201 and sends a verification email.
      // Do NOT store a token here — the account is not active yet.
      // Pass the email so the next page can show it to the user.
      navigate("/verify-email-sent", {
        replace: true,
        state: { email: form.email },
      });
    } catch (err) {
      console.error("Signup error:", err);
      setError("Could not connect to the server. Make sure Django is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-md w-96">
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
          type={showPassword ? "text" : "password"}
          className="w-full p-2 border mb-3 rounded"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          className="w-full p-2 border mb-3 rounded"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-sm text-gray-600 mb-3"
        >
          {showPassword ? "Hide passwords" : "Show passwords"}
        </button>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="text-center text-sm mt-3 text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-black underline hover:no-underline">Log in</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;