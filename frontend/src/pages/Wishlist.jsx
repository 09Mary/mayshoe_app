import { useEffect, useState } from "react";
import { getWishlist } from "../utils/wishlist";
import ProductCard from "../components/ProductCard";

function Wishlist({ addToCart }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getWishlist());
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Wishlist ❤️</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;