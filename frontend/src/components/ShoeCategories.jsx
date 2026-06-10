import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function ShoeCategories({ luxury }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (luxury) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {categories.map((cat, index) => (
          <Link
            key={index}
            to={`/shop?category=${cat.name}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "3px",
                cursor: "pointer",
                aspectRatio: "3 / 4",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector("img").style.transform = "scale(1.07)";
                e.currentTarget.querySelector(".cat-overlay").style.background =
                  "linear-gradient(to top, rgba(26,18,8,0.85) 0%, rgba(26,18,8,0.2) 60%, transparent 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector("img").style.transform = "scale(1)";
                e.currentTarget.querySelector(".cat-overlay").style.background =
                  "linear-gradient(to top, rgba(26,18,8,0.7) 0%, rgba(26,18,8,0.1) 60%, transparent 100%)";
              }}
            >
              <img
                src={`https://source.unsplash.com/400x533/?${cat.name}-shoes,luxury`}
                alt={cat.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                }}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/400x533/1A1208/C9A84C?text=${cat.name}`;
                }}
              />
              <div
                className="cat-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(26,18,8,0.7) 0%, rgba(26,18,8,0.1) 60%, transparent 100%)",
                  transition: "background 0.3s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: "#C9A84C",
                    textTransform: "uppercase",
                    marginBottom: "0.3rem",
                  }}
                >
                  Explore
                </p>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "#FAF7F2",
                    margin: 0,
                  }}
                >
                  {cat.label || cat.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // Original fallback
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
            <img
              src={`https://source.unsplash.com/400x300/?${cat.name}-shoes`}
              alt={cat.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 font-semibold text-lg">{cat.label || cat.name}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}