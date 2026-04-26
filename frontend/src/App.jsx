import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Order";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./ProductDetail";
import Wishlist from "./pages/Wishlist";
import LaunchPage from "./pages/LaunchPage";
import ProductPage from "./pages/ProductPage";


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

  // 👟 Fetch shoes
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/shoes/")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

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

  return (
    <>
      <Navbar
        cartCount={cart.length}
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

        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/shop" element={<Shop addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/wishlist"  element={<Wishlist addToCart={addToCart} />} />
        <Route path="/launch" element={<LaunchPage />} />
        <Route path="/shoe/:id" element={<ProductPage />} />


      </Routes>
    </>
  );
}

export default App;