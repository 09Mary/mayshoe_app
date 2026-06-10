import { useLocation, Link } from "react-router-dom";

function VerifyEmailSent() {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
        <p className="text-gray-600 text-sm mb-6">
          We sent a verification link to <strong>{email}</strong>. 
          Click it to activate your account.
        </p>
        <Link to="/auth" className="w-full block bg-black text-white py-2 rounded hover:bg-gray-800 transition">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmailSent;