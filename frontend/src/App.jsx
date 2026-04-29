import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Orders from "./pages/Order";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./ProductDetail";
import Wishlist from "./pages/Wishlist";
import LaunchPage from "./pages/LaunchPage";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

import { getUser, isAuthenticated } from "./utils/auth";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 Check login on load
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setUser(getUser());
  }, []);
  
   // login persistent across refresh
  useEffect(() => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (token) {
    setIsLoggedIn(true);
  }
}, []);

  // 👟 Fetch shoes
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/shoes/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // 🛒 Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 💾 Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ➕ Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // 🧮 Correct cart count (includes quantity)
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
        <Route
          path="/"
          element={<Home addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route path="/signup" element={<Signup />} />

        <Route path="/orders" element={<Orders />} />

        <Route
          path="/shop"
          element={<Shop addToCart={addToCart} />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetail addToCart={addToCart} />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist addToCart={addToCart} />}
        />

        <Route path="/launch" element={<LaunchPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />

      </Routes>
    </>
  );
}

export default App;