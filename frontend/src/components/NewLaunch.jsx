import { useEffect, useState } from "react";
import axios from "axios";

export function NewLaunch() {
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/shoes/latest/")
      .then((res) => {
        setShoe(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-20">Loading new launch...</p>;
  }

  if (!shoe) {
    return <p className="text-center mt-20">No new launch available</p>;
  }

  return (
    <div className="mt-24 px-6 text-center">
      <h2 className="text-3xl font-bold mb-10">🔥 New Launch</h2>

      <div className="bg-white text-black max-w-4xl mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img
          src={'http://127.0.0.1:8000${shoe.image}'}
          alt={shoe.name}
          className="w-full md:w-1/2 object-cover"
        />

        <div className="p-8 flex flex-col justify-center text-left">
          <h3 className="text-2xl font-bold mb-2">{shoe.name}</h3>
          <p className="text-gray-600 mb-4">{shoe.description}</p>
          <p className="text-xl font-semibold mb-6">
            KES {shoe.price}
          </p>

          <a
            href={`/shoe/${shoe.id}`}
            className="bg-black text-white px-5 py-2 rounded-full w-fit"
          >
            View Product
          </a>
        </div>
      </div>
    </div>
  );
}