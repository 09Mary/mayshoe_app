import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./pages/Cart";
import Login from "./pages/Login";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/shoes/")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

   // ADDING TO CART
  const addToCart = (product) => {
    const token = localStorage.getItem("token");

  // Allow guest browsing BUT block checkout dependency later
  if (!token) {
    alert("You are browsing as guest. Login required for checkout.");
  }

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
      <Navbar cartCount={cart.length} />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          }
        />

        {/* Cart Page */}
        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />
        {/* Login Page */}
        <Route
         path="/login" 
         element={<Login />} />
      </Routes>
    </>
  );
}

export default App;