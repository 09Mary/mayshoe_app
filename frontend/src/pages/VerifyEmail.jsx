import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = "http://127.0.0.1:8000/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setState("error");
      setMessage("No verification token found in the link.");
      return;
    }
    fetch(`${API}/auth/verify-email/?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.detail && !data.detail.toLowerCase().includes("invalid")) {
          setState("success");
          setTimeout(() => navigate("/auth"), 3000);
        } else {
          setState("error");
          setMessage(data.detail || "Verification failed.");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Could not connect to the server.");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow p-10 max-w-md w-full text-center">
        {state === "verifying" && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-xl font-bold">Verifying your email…</h2>
          </>
        )}
        {state === "success" && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Email verified!</h2>
            <p className="text-gray-600">Redirecting you to login…</p>
          </>
        )}
        {state === "error" && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2">Verification failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button onClick={() => navigate("/auth")} className="btn btn-outline btn-sm">
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}