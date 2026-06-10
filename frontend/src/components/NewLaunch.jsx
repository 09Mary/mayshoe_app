import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function NewLaunch({ luxury }) {
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/shoes/latest/")
      .then((res) => { setShoe(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p style={{ color: luxury ? "#6B5B45" : "#888", textAlign: "center", padding: "2rem 0" }}>
        Loading…
      </p>
    );
  }

  if (!shoe) {
    return (
      <p style={{ color: luxury ? "#6B5B45" : "#888", textAlign: "center", padding: "2rem 0" }}>
        No new launch available yet.
      </p>
    );
  }

  if (luxury) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          background: "#231a0d",
          borderRadius: "3px",
          overflow: "hidden",
          maxWidth: "900px",
        }}
      >
        <div style={{ overflow: "hidden", position: "relative" }}>
          <img
            src={`http://127.0.0.1:8000${shoe.image}`}
            alt={shoe.name}
            style={{ width: "100%", height: "420px", objectFit: "cover", display: "block" }}
            onError={(e) => { e.target.src = "https://via.placeholder.com/500x420/231a0d/C9A84C?text=MAYSHOE"; }}
          />
          {/* Gold overlay strip */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "#C9A84C" }} />
        </div>

        <div
          style={{
            padding: "3rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>
            Just Dropped
          </p>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#FAF7F2",
              marginBottom: "1rem",
              lineHeight: 1.25,
            }}
          >
            {shoe.name}
          </h3>
          <p style={{ fontSize: "0.88rem", color: "#8a7560", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            {shoe.description}
          </p>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#C9A84C",
              marginBottom: "2rem",
            }}
          >
            Ksh {Number(shoe.price).toLocaleString()}
          </p>
          <Link
            to={`/product/${shoe.id}`}
            style={{
              display: "inline-block",
              background: "#C9A84C",
              color: "#1A1208",
              padding: "0.75rem 1.75rem",
              borderRadius: "2px",
              textDecoration: "none",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              width: "fit-content",
            }}
          >
            View Product
          </Link>
        </div>
      </div>
    );
  }

  // Fallback: original style
  return (
    <div className="mt-24 px-6 text-center">
      <h2 className="text-3xl font-bold mb-10">🔥 New Launch</h2>
      <div className="bg-white text-black max-w-4xl mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img src={`http://127.0.0.1:8000${shoe.image}`} alt={shoe.name} className="w-full md:w-1/2 object-cover" />
        <div className="p-8 flex flex-col justify-center text-left">
          <h3 className="text-2xl font-bold mb-2">{shoe.name}</h3>
          <p className="text-gray-600 mb-4">{shoe.description}</p>
          <p className="text-xl font-semibold mb-6">KES {shoe.price}</p>
          <a href={`/shoe/${shoe.id}`} className="bg-black text-white px-5 py-2 rounded-full w-fit">View Product</a>
        </div>
      </div>
    </div>
  );
}