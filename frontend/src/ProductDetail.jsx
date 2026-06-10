import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getWishlist, toggleWishlist } from "./utils/wishlist";

const BASE = "http://127.0.0.1:8000";
const SIZES = ["36", "37", "38", "39", "40", "41", "42"];

function imgUrl(path) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${BASE}${path}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ImageGallery({ mainImage, variants, selectedColor }) {
  const [active, setActive] = useState(null);

  // Collect all images: main shoe image + any variant images for the selected color
  const colorVariants = variants.filter(
    (v) => v.color === selectedColor && v.image
  );
  const gallery = [
    mainImage && { src: imgUrl(mainImage), label: "Main" },
    ...colorVariants.map((v) => ({ src: imgUrl(v.image), label: v.size })),
  ].filter(Boolean);

  const displayed = active ?? gallery[0]?.src ?? null;

  // Reset when color changes
  useEffect(() => setActive(null), [selectedColor]);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
        {displayed ? (
          <img
            src={displayed}
            alt="Product"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <span className="text-7xl">👟</span>
        )}
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {gallery.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(item.src)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                (active ?? gallery[0]?.src) === item.src
                  ? "border-black"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img src={item.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ColorSwatch({ color, selected, onClick, hasStock }) {
  // Map color names to approximate CSS colors
  const COLOR_MAP = {
    black: "#111", white: "#fff", red: "#ef4444", blue: "#3b82f6",
    navy: "#1e3a5f", brown: "#92400e", grey: "#9ca3af", gray: "#9ca3af",
    green: "#22c55e", yellow: "#eab308", pink: "#ec4899", purple: "#a855f7",
    orange: "#f97316", beige: "#d4b896", tan: "#c9a96e", cream: "#f5f0e8",
    silver: "#c0c0c0", gold: "#d4af37",
  };
  const bg = COLOR_MAP[color?.toLowerCase()] || "#e5e7eb";
  const isLight = ["white", "cream", "beige", "yellow", "silver"].includes(color?.toLowerCase());

  return (
    <button
      onClick={onClick}
      title={color}
      disabled={!hasStock}
      className={`relative w-9 h-9 rounded-full border-2 transition-all ${
        selected ? "border-black scale-110" : "border-transparent hover:border-gray-300"
      } ${!hasStock ? "opacity-40 cursor-not-allowed" : ""}`}
      style={{ backgroundColor: bg, boxShadow: isLight ? "inset 0 0 0 1px #e5e7eb" : "none" }}
    >
      {!hasStock && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-6 h-px bg-gray-400 rotate-45 block" />
        </span>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

function ProductDetail({ addToCart }) {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [shoe, setShoe]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [selectedColor, setColor]   = useState(null);
  const [selectedSize, setSize]     = useState(null);
  const [wished, setWished]         = useState(false);
  const [addedMsg, setAddedMsg]     = useState("");
  const [error, setError]           = useState("");

  useEffect(() => {
    fetch(`${BASE}/api/shoes/${id}/`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        setShoe(data);
        // Pre-select first color that has stock
        const firstInStock = [...new Set((data.variants || []).map(v => v.color))]
          .find(color => (data.variants || []).some(v => v.color === color && v.stock > 0));
        setColor(firstInStock || data.variants?.[0]?.color || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (shoe) setWished(getWishlist().some(w => w.id === shoe.id));
  }, [shoe]);

  // Reset size when color changes
  useEffect(() => setSize(null), [selectedColor]);

  // Unique colors from variants
  const colors = shoe ? [...new Set(shoe.variants?.map(v => v.color))] : [];

  // Sizes available for selected color (only those with stock)
  const variantsForColor = shoe?.variants?.filter(v => v.color === selectedColor) || [];
  const stockForSize = (size) =>
    variantsForColor.find(v => v.size === size)?.stock || 0;

  const colorHasStock = (color) =>
    shoe?.variants?.some(v => v.color === color && v.stock > 0);

  const selectedVariant = variantsForColor.find(v => v.size === selectedSize);
  const sizeStock = selectedVariant?.stock || 0;

  const handleAddToCart = () => {
    setError("");
    if (colors.length > 0 && !selectedColor) return setError("Please select a colour.");
    if (variantsForColor.length > 0 && !selectedSize) return setError("Please select a size.");
    if (sizeStock === 0) return setError("This size is out of stock.");

    addToCart({
      ...shoe,
      color: selectedColor,
      size: selectedSize,
      variantId: selectedVariant?.id,
      // unique cart key per variant
      cartKey: `${shoe.id}-${selectedColor}-${selectedSize}`,
    });

    setAddedMsg("Added to cart!");
    setTimeout(() => setAddedMsg(""), 2500);
  };

  const handleWishlist = () => {
    toggleWishlist(shoe);
    setWished(!wished);
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span className="text-sm">Loading product…</span>
      </div>
    </div>
  );

  if (!shoe) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-gray-500">
      <span className="text-5xl">🔍</span>
      <p className="font-medium">Product not found.</p>
      <Link to="/shop" className="text-sm underline hover:text-black transition-colors">Back to shop</Link>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{shoe.name}</span>
        </nav>
      </div>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 grid md:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* Left — gallery */}
        <ImageGallery
          mainImage={shoe.image}
          variants={shoe.variants || []}
          selectedColor={selectedColor}
        />

        {/* Right — details */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            {shoe.brand && (
              <p className="text-xs tracking-[0.25em] uppercase text-gray-400 font-medium mb-2">
                {shoe.brand}
              </p>
            )}
            <h1 className="font-black text-gray-900 leading-tight mb-2"
              style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}>
              {shoe.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">
                Ksh {Number(shoe.price).toLocaleString()}
              </span>
              {shoe.is_available
                ? <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">In stock</span>
                : <span className="text-xs font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full">Out of stock</span>
              }
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Colour selector */}
          {colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">Colour</p>
                {selectedColor && (
                  <p className="text-sm text-gray-500 capitalize">{selectedColor}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map(color => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    selected={selectedColor === color}
                    hasStock={colorHasStock(color)}
                    onClick={() => setColor(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {selectedColor && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">Size (EU)</p>
                {selectedSize && sizeStock > 0 && sizeStock <= 3 && (
                  <p className="text-xs text-amber-600 font-medium">Only {sizeStock} left!</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => {
                  const stock = stockForSize(size);
                  const hasVariant = variantsForColor.some(v => v.size === size);
                  const inStock = stock > 0;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      onClick={() => inStock && hasVariant && setSize(size)}
                      disabled={!inStock || !hasVariant}
                      className={`w-12 h-12 text-sm font-medium rounded-xl border-2 transition-all relative
                        ${isSelected
                          ? "border-black bg-black text-white"
                          : inStock && hasVariant
                            ? "border-gray-200 text-gray-900 hover:border-black"
                            : "border-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                    >
                      {size}
                      {/* Slash for unavailable */}
                      {(!inStock || !hasVariant) && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="w-8 h-px bg-gray-200 rotate-45 block" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Greyed out sizes are unavailable in {selectedColor}.
              </p>
            </div>
          )}

          {/* Description */}
          {shoe.description && (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">About this shoe</p>
              <p className="text-sm text-gray-500 leading-relaxed">{shoe.description}</p>
            </div>
          )}

          {/* Error / success */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
          )}
          {addedMsg && (
            <p className="text-sm text-green-600 bg-green-50 px-4 py-2.5 rounded-xl">✓ {addedMsg}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={!shoe.is_available}
              className="flex-1 bg-black text-white py-3.5 text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {shoe.is_available ? "Add to cart" : "Out of stock"}
            </button>
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                wished ? "border-red-400 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-gray-400"
              }`}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg className="w-5 h-5" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            {[
              { icon: "🚚", label: "Free delivery", sub: "Nairobi orders" },
              { icon: "↩️", label: "Easy returns",  sub: "Within 7 days"  },
              { icon: "🔒", label: "Secure pay",    sub: "M-Pesa & card"  },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1 py-3">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-medium text-gray-700">{label}</span>
                <span className="text-[10px] text-gray-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;