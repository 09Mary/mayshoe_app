import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function Login({ setIsLoggedIn }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  // if already logged in, redirect away - don't show login
  useEffect(() => {
    if ( isAuthenticated()) {
       navigate(redirectTo, { replace: true});
    }
  }, []);

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

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Server returned an unexpected response. Please try again.");
        return;
      }

      console.log("Login response:", res.status, data);

      if (!res.ok) {
        const detail = data?.detail || "";

        if (
          detail.toLowerCase().includes("verify") ||
          detail.toLowerCase().includes("verified") ||
          detail.toLowerCase().includes("active")
        ) {
          setError(
            "Your email hasn't been verified yet. Check your inbox for the verification link."
          );
        } else if (res.status === 401) {
          setError("Incorrect username or password.");
        } else {
          setError(detail || "Login failed. Please try again.");
        }
        return;
      }

      // Extract token — SimpleJWT returns { access, refresh }
      const token = data.access || data.token;
      if (!token) {
        console.error("No token in response:", data);
        setError("Login failed — no token received. Please try again.");
        return;
      }

      // Always store the access token in localStorage so it survives
      // page navigations (sessionStorage is cleared on certain redirects).
      // Only the refresh token respects the "remember me" preference.
      localStorage.setItem("token", token);
      if (data.refresh) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("refresh", data.refresh);
      }

      // Store user info if returned
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setIsLoggedIn(true);
      navigate(redirectTo, { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Cannot reach the server. Make sure the backend is running.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mayshoe</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5"
          noValidate
        >
          {/* Username / Email */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              placeholder="e.g. john or john@email.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800 font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 accent-black"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="/reset-password"
              className="text-sm text-gray-500 hover:text-black underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-black font-medium hover:underline underline-offset-2">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;