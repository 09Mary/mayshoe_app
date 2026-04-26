import { Link } from "react-router-dom";
import { logout } from "../utils/auth";


function Navbar({ cartCount,isLoggedIn,setIsLoggedIn,user }) {
    
    const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // Show Username
  {isLoggedIn && (  
      <Link to="/orders">My Orders</Link>

  ) 
    user && (
  <span className="text-gray-600">
    Hi, {user.username}
  </span>
  
)}

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      
      {/* Brand */}
      <Link to="/" className="text-xl font-bold">
        MAY Shoe Store 👟
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6 text-sm font-medium">
        
        <Link
          to="/"
          className="text-gray-700 hover:text-black transition"
        >
          Home
        </Link>

      
        <Link to="/shop">Shop</Link>
        <Link to="/launch">New Launch</Link>
        <Link to="/wishlist">Wishlist</Link>


       
        {/* Cart */}
        <Link
          to="/cart"
          className="relative bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Cart

          {/* Cart badge */}
          {cartCount > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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
        <Link
           to="/signup"
           className="text-gray-700 hover:text-black transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;