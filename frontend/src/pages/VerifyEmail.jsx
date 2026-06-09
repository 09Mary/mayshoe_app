import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/auth/verify-email/?token=${token}`
        );
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.detail || "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(data.detail || "Invalid or expired verification link.");
        }
      } catch {
        setStatus("error");
        setMessage("Could not connect to the server. Try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">

        {status === "loading" && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-xl font-bold mb-2">Verifying your email…</h2>
            <p className="text-gray-500 text-sm">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Email verified!</h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Log in to your account
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2">Verification failed</h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Back to login
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;