function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-cover rounded"
      />

      <h2 className="text-lg font-semibold mt-2">
        {product.name}
      </h2>

      <p className="text-gray-600">
        Ksh {product.price}
      </p>

      <button
        onClick={() => addToCart(product)}
        className="mt-3 bg-black text-white px-4 py-2 rounded w-full"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;