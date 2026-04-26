import { useEffect, useState } from "react";
import axios from "axios";

export function TimelyShop() {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/shoes/timely/")
      .then((res) => {
        setShoes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-20">Loading timely deals...</p>;
  }

  if (shoes.length === 0) {
    return (
      <p className="text-center mt-20">
        No shoes available right now ⏳
      </p>
    );
  }

  return (
    <div className="mt-24 px-6 text-center pb-20">
      <h2 className="text-3xl font-bold mb-10">⏰ Timely Shop</h2>
      <p className="text-gray-400 mb-8">
        Limited drops and currently available sneakers
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {shoes.map((shoe) => (
          <div
            key={shoe.id}
            className="bg-white text-black rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={'http://127.0.0.1:8000${shoe.image}'}
              alt={shoe.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-5 text-left">
              <h3 className="font-bold text-lg">{shoe.name}</h3>
              <p className="text-gray-600">KES {shoe.price}</p>

              {/* 🔥 Availability badge */}
              <p className="text-green-600 font-semibold mt-2">
                Available Now
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}