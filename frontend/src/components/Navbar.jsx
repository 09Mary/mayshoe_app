import { Link } from "react-router-dom";

function Navbar({ cartCount = 0 }) {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      
      {/* Brand */}
      <Link to="/" className="text-xl font-bold">
        MAY Shoe Store 👟
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        
        <Link
          to="/"
          className="text-gray-700 hover:text-black transition"
        >
          Home
        </Link>

        <Link
          to="/"
          className="text-gray-700 hover:text-black transition"
        >
          Shop
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Cart

          {/* Cart badge */}
          {cartCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Auth placeholder */}
        <Link
           to="/login"
           className="text-gray-700 hover:text-black transition"
        >
           Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;