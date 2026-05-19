import { Link, useNavigate } from "react-router-dom";
import { logout, isStaff } from "../utils/auth";

function Navbar({ cartCount, isLoggedIn, setIsLoggedIn, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        MAY Shoe Store
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="text-gray-700 hover:text-black transition">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/launch">New Launch</Link>

        {isLoggedIn && <Link to="/wishlist">Wishlist</Link>}

        <Link
          to="/cart"
          className="relative bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Cart
          {cartCount > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <>
            {user && (
              <span className="text-gray-600 hidden sm:inline">
                Hi, {user.username}
              </span>
            )}
            <Link to="/orders" className="text-gray-700 hover:text-black">My Orders</Link>
            <Link to="/profile" className="text-gray-700 hover:text-black">Profile</Link>
            {isStaff() && (
              <Link
                to="/admin-dashboard"
                className="text-indigo-600 font-semibold hover:text-indigo-800"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-black"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="text-gray-700 hover:text-black">Login</Link>
            <Link
              to="/auth"
              className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;