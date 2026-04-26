import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export function ShoeCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mt-24 px-6 text-center">
      <h2 className="text-3xl font-bold mb-10">👟 Shoe Categories</h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white text-black rounded-2xl overflow-hidden shadow-lg"
          >
            {/* Temporary image since backend doesn't send images */}
            <img
              src={`https://source.unsplash.com/400x300/?${cat.name}-shoes`}
              alt={cat.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 font-semibold text-lg">
              {cat.label || cat.name}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}