import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/shoes/${id}/`)
      .then((res) => {
        setShoe(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!shoe) return <p className="text-center mt-20">Shoe not found</p>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* Image */}
        <img
          src={`http://127.0.0.1:8000${shoe.image}`}
          alt={shoe.name}
          className="rounded-2xl"
        />

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{shoe.name}</h1>
          <p className="text-gray-400 mb-2">{shoe.brand}</p>

          <p className="text-2xl font-semibold mb-6">
            KES {shoe.price}
          </p>

          <p className="mb-6">{shoe.description}</p>

          {/* Availability */}
          {shoe.is_available ? (
            <p className="text-green-500 font-semibold mb-4">
              Available Now
            </p>
          ) : (
            <p className="text-red-500 font-semibold mb-4">
              Not Available
            </p>
          )}

          {/* Actions */}
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold mr-4">
            Add to Cart
          </button>

          <button className="border border-white px-6 py-3 rounded-full">
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}