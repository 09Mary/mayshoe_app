import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error();

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <input
        name="username"
        value={user.username}
        onChange={handleChange}
        className="w-full mb-2 p-2 border"
      />

      <input
        name="email"
        value={user.email}
        onChange={handleChange}
        className="w-full mb-4 p-2 border"
      />

      <button
        onClick={handleUpdate}
        className="w-full bg-black text-white py-2 rounded"
      >
        Update Profile
      </button>
    </div>
  );
}

export default Profile;