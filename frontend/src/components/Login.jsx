import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  // 📩 Email validation
  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ VALIDATION (you missed this part)
    if (!identifier) {
      setError("Enter username or email");
      return;
    }

    if (!password) {
      setError("Enter password");
      return;
    }

    if (identifier.includes("@") && !isValidEmail(identifier)) {
      setError("Enter a valid email address");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: identifier,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.access) {
        // 🔐 REMEMBER ME LOGIC (you missed this)
        if (rememberMe) {
          localStorage.setItem("token", data.access);
          localStorage.setItem("refresh", data.refresh);
        } else {
          sessionStorage.setItem("token", data.access);
        }

        setIsLoggedIn(true);

        navigate(redirectTo);
      } else {
        setError("Invalid username/email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 shadow-md rounded w-80"
      >
        <h2 className="text-xl mb-4 font-bold">Login</h2>

        {/* USERNAME / EMAIL */}
        <div className="mb-3">
          <label className="block text-sm mb-1">
            Username or Email
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter your username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        {/* PASSWORD WITH TOGGLE */}
        <div className="mb-3 relative">
          <label className="block text-sm mb-1">Password</label>

          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded"
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

        {/* REMEMBER ME */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label className="text-sm">Remember me</label>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;