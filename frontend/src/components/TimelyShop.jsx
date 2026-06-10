import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function TimelyShop({ luxury, addToCart }) {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/shoes/timely/")
      .then((res) => { setShoes(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p style={{ color: luxury ? "#6B5B45" : "#888", textAlign: "center", padding: "2rem 0" }}>
        Loading picks…
      </p>
    );
  }

  if (shoes.length === 0) {
    return (
      <p style={{ color: luxury ? "#6B5B45" : "#888", textAlign: "center", padding: "2rem 0" }}>
        Check back soon for limited drops.
      </p>
    );
  }

  if (luxury) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {shoes.map((shoe) => {
          return (
            <LuxuryTimelyCard
              key={shoe.id}
              shoe={shoe}
              addToCart={addToCart}
            />
          );
        })}
      </div>
    );
  }

  // Original fallback
  return (
    <div className="mt-24 px-6 text-center pb-20">
      <h2 className="text-3xl font-bold mb-10">⏰ Timely Shop</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {shoes.map((shoe) => (
          <div key={shoe.id} className="bg-white text-black rounded-2xl overflow-hidden shadow-lg">
            <img src={`http://127.0.0.1:8000${shoe.image}`} alt={shoe.name} className="h-56 w-full object-cover" />
            <div className="p-5 text-left">
              <h3 className="font-bold text-lg">{shoe.name}</h3>
              <p className="text-gray-600">KES {shoe.price}</p>
              <p className="text-green-600 font-semibold mt-2">Available Now</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LuxuryTimelyCard({ shoe, addToCart }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (addToCart) addToCart(shoe);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: "3px",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 16px 48px rgba(26,18,8,0.12)"
          : "0 2px 10px rgba(26,18,8,0.06)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
    >
      <Link to={`/product/${shoe.id}`} style={{ display: "block", overflow: "hidden" }}>
        <img
          src={`http://127.0.0.1:8000${shoe.image}`}
          alt={shoe.name}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x220/F7F3EE/C9A84C?text=MAYSHOE";
          }}
        />
      </Link>

      <div
        style={{
          height: "2px",
          background: hovered
            ? "linear-gradient(to right, transparent, #C9A84C, transparent)"
            : "linear-gradient(to right, transparent, #E8D5B7, transparent)",
          transition: "background 0.4s",
        }}
      />

      <div style={{ padding: "1.1rem 1.25rem 1.3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          <Link to={`/product/${shoe.id}`} style={{ textDecoration: "none" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.98rem",
                fontWeight: 600,
                color: "#1A1208",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {shoe.name}
            </h3>
          </Link>
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              background: "#E8D5B7",
              color: "#1A1208",
              padding: "0.2rem 0.55rem",
              borderRadius: "2px",
              textTransform: "uppercase",
              fontWeight: 500,
              whiteSpace: "nowrap",
              marginLeft: "0.5rem",
            }}
          >
            In Stock
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#1A1208",
              margin: 0,
            }}
          >
            Ksh {Number(shoe.price).toLocaleString()}
          </p>

          <button
            onClick={handleAdd}
            style={{
              background: added ? "#C9A84C" : "#1A1208",
              color: "#FAF7F2",
              border: "none",
              padding: "0.45rem 1rem",
              borderRadius: "2px",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.25s",
            }}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}