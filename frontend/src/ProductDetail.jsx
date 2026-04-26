import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/shoes/${id}/`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
      
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg"
      />

      {/* DETAILS */}
      <div>
        <h1 className="text-3xl font-bold mb-3">
          {product.name}
        </h1>

        <p className="text-gray-500 mb-4">
          Premium quality sneaker for everyday wear.
        </p>

        <p className="text-2xl font-bold mb-6">
          Ksh {product.price}
        </p>

        <button
          onClick={() => window.history.back(product)}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;