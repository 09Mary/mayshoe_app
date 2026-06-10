import { Link } from "react-router-dom";
import { toggleWishlist, getWishlist } from "../utils/wishlist";
import { useState, useEffect } from "react";

function ProductCard({ product, addToCart }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const wishlist = getWishlist();
    setLiked(wishlist.some((item) => item.id === product.id));
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setLiked((l) => !l);
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
          ? "0 20px 60px rgba(26,18,8,0.13), 0 4px 16px rgba(26,18,8,0.07)"
          : "0 2px 12px rgba(26,18,8,0.06)",
        transition: "box-shadow 0.35s ease, transform 0.35s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        position: "relative",
      }}
    >
      {/* ── Wishlist button ── */}
      <button
        onClick={handleWishlist}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        style={{
          position: "absolute",
          top: "0.85rem",
          right: "0.85rem",
          zIndex: 10,
          background: "rgba(250,247,242,0.88)",
          border: "none",
          borderRadius: "50%",
          width: "34px",
          height: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "0.9rem",
          backdropFilter: "blur(4px)",
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 0.2s",
        }}
      >
        {liked ? "♥" : "♡"}
      </button>

      {/* ── Image ── */}
      <Link to={`/product/${product.id}`} style={{ display: "block", overflow: "hidden" }}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300/F7F3EE/C9A84C?text=MAYSHOE";
          }}
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
      </Link>

      {/* ── Gold hairline ── */}
      <div
        style={{
          height: "1px",
          background: hovered
            ? "linear-gradient(to right, transparent, #C9A84C, transparent)"
            : "linear-gradient(to right, transparent, #E8D5B7, transparent)",
          transition: "background 0.4s",
        }}
      />

      {/* ── Details ── */}
      <div style={{ padding: "1.2rem 1.25rem 1.4rem" }}>
        <Link
          to={`/product/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#1A1208",
              marginBottom: "0.25rem",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h2>
        </Link>

        <p
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#C9A84C",
            marginBottom: "1rem",
          }}
        >
          Premium Quality
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "#1A1208",
            }}
          >
            Ksh {Number(product.price).toLocaleString()}
          </p>

          <button
            onClick={handleAddToCart}
            style={{
              background: added ? "#C9A84C" : "#1A1208",
              color: "#FAF7F2",
              border: "none",
              padding: "0.5rem 1.1rem",
              borderRadius: "2px",
              fontSize: "0.72rem",
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

export default ProductCard;