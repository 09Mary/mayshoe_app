import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

import Cart from "./pages/Cart";
import Orders from "./pages/Order";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./ProductDetail";
import Wishlist from "./pages/Wishlist";
import LaunchPage from "./pages/LaunchPage";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminReviews from "./pages/admin/AdminReviews";
import VerifyEmailSent from "./pages/VerifyEmailSent";

import { getUser, isAuthenticated } from "./utils/auth";

function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const [user, setUser] = useState(() => getUser());



  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <Navbar
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/shop" element={<Shop addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/launch" element={<LaunchPage />} />
        <Route path="/auth" element={<Auth setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordConfirm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
        


        {/* Customer */}
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist addToCart={addToCart} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin-dashboard/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin-dashboard/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin-dashboard/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default App;