import { useState } from "react";
import api from "../api/axiosConfig";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("auth/login/", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access);
      alert("Login successful!");
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}