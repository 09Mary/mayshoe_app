import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const categories = ["all", "sneakers", "running", "casual", "boots"];

/* =========================
   🧠 CUSTOM HOOK: DEBOUNCE
========================= */
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* =========================
   🔗 API QUERY BUILDER
========================= */
function buildQuery({ search, category, maxPrice, sort }) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (maxPrice) params.append("max_price", maxPrice);
  if (sort) params.append("ordering", sort);

  return params.toString();
}

function Shop({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    maxPrice: "",
    sort: "-id",
  });

  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(filters.search);

  /* =========================
     📡 FETCH PRODUCTS
  ========================= */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const query = buildQuery({
          ...filters,
          search: debouncedSearch,
        });

        const res = await fetch(
          `http://127.0.0.1:8000/api/shoes/?${query}`
        );

        const data = await res.json();

        // supports pagination or plain array
        setProducts(data.results || data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, filters.category, filters.maxPrice, filters.sort]);

  /* =========================
     🧹 RESET FILTERS
  ========================= */
  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      maxPrice: "",
      sort: "-id",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* 🧠 HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shop</h1>
        <p className="text-gray-500 text-sm">
          Discover premium footwear collection
        </p>
      </div>

      {/* 📌 FILTER BAR */}
      <div className="sticky top-0 bg-white z-10 py-3 space-y-3 border-b">

        {/* 🔍 SEARCH + INPUTS */}
        <div className="flex flex-col md:flex-row gap-3">

          <input
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            placeholder="Search shoes..."
            className="border p-2 rounded w-full md:w-1/2"
          />

          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxPrice: e.target.value }))
            }
            placeholder="Max price"
            className="border p-2 rounded w-full md:w-1/4"
          />

          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort: e.target.value }))
            }
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="-id">Newest</option>
            <option value="price">Price: Low → High</option>
            <option value="-price">Price: High → Low</option>
          </select>
        </div>

        {/* 🟣 CATEGORY PILLS */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const value = cat === "all" ? "" : cat;

            return (
              <button
                key={cat}
                onClick={() =>
                  setFilters((f) => ({ ...f, category: value }))
                }
                className={`px-4 py-1 rounded-full whitespace-nowrap border ${
                  (filters.category === "" && cat === "all") ||
                  filters.category === value
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 🧾 ACTIVE FILTERS */}
        {(filters.search || filters.category || filters.maxPrice) && (
          <div className="flex flex-wrap gap-2 text-sm">

            {filters.search && (
              <span className="bg-gray-200 px-3 py-1 rounded-full">
                🔍 {filters.search}
              </span>
            )}

            {filters.category && (
              <span className="bg-gray-200 px-3 py-1 rounded-full">
                🏷 {filters.category}
              </span>
            )}

            {filters.maxPrice && (
              <span className="bg-gray-200 px-3 py-1 rounded-full">
                💰 ≤ {filters.maxPrice}
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-red-500 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* 📦 PRODUCTS */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="bg-gray-200 h-40 rounded"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
              <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No products found 😕
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Shop;