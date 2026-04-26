import { Link } from "react-router-dom";
import { toggleWishlist,getWishlist } from "../utils/wishlist";
import { useState,useEffect } from "react";

function ProductCard({ product, addToCart }) {
  const [liked, setLiked] = useState(false);

useEffect(() => {
  const wishlist = getWishlist();
  setLiked(wishlist.some((item) => item.id === product.id));
}, [product.id]);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4">
      
      {/* 👟 IMAGE (clickable) */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
              e.target.src = "https://via.placeholder.com/300";
           }}
           className="h-56 w-full object-cover rounded-lg"        />
      </Link>

      {/* 📄 DETAILS */}
      <div className="mt-3">
        
        {/* NAME (clickable) */}
        <Link to={`/product/${product.id}`}>
          <h2 className="text-lg font-semibold hover:underline">
            {product.name}
          </h2>
        </Link>

        <p className="text-gray-500 text-sm">
          Premium Quality
        </p>

        <div className="flex justify-between items-center mt-2">
          <p className="font-bold">Ksh {product.price}</p>

          <button
            onClick={() => {addToCart(product); 
              toggleWishlist(product);
              setLiked(!liked);
            }}
            className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
          >
            Add
            {liked ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;