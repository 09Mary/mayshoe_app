import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/home";

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier) { setError("Enter your username or email."); return; }
    if (!password)    { setError("Enter your password."); return; }
    if (identifier.includes("@") && !isValidEmail(identifier)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      });

      const data = await res.json();
      console.log("Login response:", res.status, data);

      if (!res.ok) {
        // 401 from your backend means either wrong password OR email not verified.
        // Check the detail message to show the right hint.
        const detail = data?.detail || "";

        if (
          detail.toLowerCase().includes("verify") ||
          detail.toLowerCase().includes("active")
        ) {
          setError(
            "Your email hasn't been verified yet. Check your inbox for the verification link."
          );
        } else {
          setError("Incorrect username or password.");
        }
        return;
      }

      const token = data.access || data.token;
      if (!token) { setError("Login failed — no token received."); return; }

      if (rememberMe) {
        localStorage.setItem("token", token);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);
      } else {
        sessionStorage.setItem("token", token);
      }

      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoggedIn(true);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not connect to the server. Make sure Django is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 shadow-md rounded w-80">
        <h2 className="text-xl mb-4 font-bold">Login</h2>

        <div className="mb-3">
          <label className="block text-sm mb-1">Username or Email</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter your username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="mb-3 relative">
          <label className="block text-sm mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded pr-14"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 text-sm text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe" className="text-sm">Remember me</label>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          className="w-full bg-black text-white p-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        <p className="text-center text-sm mt-3">
          <a href="/reset-password" className="text-gray-500 hover:text-black underline">
            Forgot password?
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;