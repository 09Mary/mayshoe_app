import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function Auth({ setIsLoggedIn }) {   // ✅ receive it here
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Login" : "Create Account"}
      </h2>

      {/* ✅ pass it down */}
      {isLogin ? (
        <Login setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Signup />
      )}

      <p className="mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 ml-2"
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default Auth;