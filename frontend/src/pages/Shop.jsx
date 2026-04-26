import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Shop({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/shoes/")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // 🔍 FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (maxPrice === "" || product.price <= maxPrice) &&
      (category === "" || product.category === category)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* 🏷 TITLE */}
      <h1 className="text-3xl font-bold mb-6">Shop</h1>

      {/* 🔍 FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search shoes..."
          value={search}
          className="p-2 border rounded w-full md:w-1/2"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Price filter */}
        <input
          type="number"
          placeholder="Max price (Ksh)"
          value={maxPrice}
          className="p-2 border rounded w-full md:w-1/4"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* 🟣 CATEGORY BUTTONS (FIXED + CLEAN) */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "sneakers", "running", "casual", "boots"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === "all" ? "" : cat)}
            className={`px-4 py-2 rounded-full border transition ${
              (category === "" && cat === "all") || category === cat
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* 🔄 RESET BUTTON */}
      <div className="mb-6">
        <button
          onClick={() => {
            setSearch("");
            setMaxPrice("");
            setCategory("");
          }}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>

      {/* 👟 PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        )}

      </div>
    </div>
  );
}

export default Shop;