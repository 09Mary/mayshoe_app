import { Link } from "react-router-dom";
import { ShoeCategories } from "../components/ShoeCategories";
import { NewLaunch } from "../components/NewLaunch";
import { TimelyShop } from "../components/TimelyShop";
import { useEffect, useRef } from "react";

// ─── Design tokens ────────────────────────────────────────────────
// Cream:       #F7F3EE
// Champagne:   #E8D5B7
// Warm Ivory:  #FAF7F2
// Espresso:    #1A1208
// Gold accent: #C9A84C
// Muted text:  #6B5B45

export default function HomePage({ addToCart }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Load Playfair Display from Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div
      style={{ background: "#FAF7F2", fontFamily: "'Inter', sans-serif", color: "#1A1208" }}
      className="min-h-screen"
    >
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        style={{ position: "relative", height: "100vh", overflow: "hidden" }}
      >
        {/* Looping ambient video background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.45) sepia(0.25)",
          }}
          // Free-to-use Pexels MP4 — luxury shoe / fashion atmosphere
          src="https://www.w3schools.com/howto/rain.mp4"
          onError={(e) => {
            // Fallback: hide video, show gradient
            e.target.style.display = "none";
          }}
        />

        {/* Warm champagne gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(201,168,76,0.18) 0%, rgba(26,18,8,0.72) 100%)",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 1.5rem",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              letterSpacing: "0.3em",
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "#C9A84C",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Nairobi · Est. 2024
          </p>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              color: "#FAF7F2",
              maxWidth: "820px",
              marginBottom: "1.5rem",
            }}
          >
            Where Every Step
            <br />
            <em style={{ color: "#E8D5B7", fontStyle: "italic" }}>
              Speaks Luxury
            </em>
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              fontWeight: 300,
              color: "#E8D5B7",
              maxWidth: "480px",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            Curated premium footwear for those who move with intention. Each
            pair, a statement.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              to="/shop"
              style={{
                background: "#C9A84C",
                color: "#1A1208",
                padding: "0.85rem 2.2rem",
                borderRadius: "2px",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#b8943e")}
              onMouseLeave={(e) => (e.target.style.background = "#C9A84C")}
            >
              Shop Collection
            </Link>
            <Link
              to="/launch"
              style={{
                border: "1px solid rgba(232,213,183,0.6)",
                color: "#E8D5B7",
                padding: "0.85rem 2.2rem",
                borderRadius: "2px",
                fontWeight: 400,
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            color: "#E8D5B7",
            opacity: 0.6,
          }}
        >
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}>
            SCROLL
          </span>
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, #E8D5B7, transparent)",
              animation: "scrollPulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ── AS SEEN ON ───────────────────────────────────────────── */}
      <section
        style={{
          background: "#1A1208",
          padding: "2.2rem 2rem",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "0.65rem",
            letterSpacing: "0.28em",
            color: "#6B5B45",
            textTransform: "uppercase",
            marginBottom: "1.6rem",
          }}
        >
          As Seen In
        </p>

        {/* Marquee strip */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              gap: "3.5rem",
              alignItems: "center",
              animation: "marquee 22s linear infinite",
              width: "max-content",
            }}
          >
            {[
              "Vogue Africa",
              "Business Daily",
              "Nairobi Fashion Week",
              "DRUM Magazine",
              "Pulse Kenya",
              "True Love East Africa",
              "Vogue Africa",
              "Business Daily",
              "Nairobi Fashion Week",
              "DRUM Magazine",
              "Pulse Kenya",
              "True Love East Africa",
            ].map((brand, i) => (
              <span
                key={i}
                style={{
                  color: i % 2 === 0 ? "#C9A84C" : "#6B5B45",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  fontStyle: i % 3 === 1 ? "italic" : "normal",
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND PILLARS ────────────────────────────────────────── */}
      <section
        style={{
          background: "#F7F3EE",
          padding: "5rem 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {[
          { icon: "✦", title: "Premium Materials", desc: "Hand-selected leathers & textiles sourced from certified suppliers." },
          { icon: "◈", title: "Artisan Craft", desc: "Each pair constructed with old-world techniques, finished by hand." },
          { icon: "❋", title: "Exclusive Drops", desc: "Limited editions released seasonally — never mass produced." },
          { icon: "◇", title: "Free Delivery", desc: "Complimentary delivery across Nairobi. Nationwide within 48 hrs." },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              padding: "2.5rem 2rem",
              borderRight: i < 3 ? "1px solid #E8D5B7" : "none",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "1.4rem",
                color: "#C9A84C",
                marginBottom: "1rem",
              }}
            >
              {p.icon}
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.05rem",
                fontWeight: 600,
                marginBottom: "0.6rem",
                color: "#1A1208",
              }}
            >
              {p.title}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#6B5B45", lineHeight: 1.7 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", background: "#FAF7F2" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              letterSpacing: "0.25em",
              fontSize: "0.65rem",
              color: "#C9A84C",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Explore
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "3rem",
              color: "#1A1208",
            }}
          >
            Shop by Category
          </h2>
          <ShoeCategories luxury />
        </div>
      </section>

      {/* ── NEW LAUNCH ──────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 2rem",
          background: "#1A1208",
          color: "#FAF7F2",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              letterSpacing: "0.25em",
              fontSize: "0.65rem",
              color: "#C9A84C",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Just Arrived
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "3rem",
              color: "#FAF7F2",
            }}
          >
            New Launch
          </h2>
          <NewLaunch luxury />
        </div>
      </section>

      {/* ── TIMELY SHOP ─────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", background: "#F7F3EE" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              letterSpacing: "0.25em",
              fontSize: "0.65rem",
              color: "#C9A84C",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Limited Time
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "3rem",
              color: "#1A1208",
            }}
          >
            Timely Picks
          </h2>
          <TimelyShop luxury addToCart={addToCart} />
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#1A1208",
          padding: "4rem 2rem 2.5rem",
          color: "#6B5B45",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#E8D5B7",
                fontSize: "1.4rem",
                fontWeight: 700,
                marginBottom: "0.8rem",
              }}
            >
              MAYSHOE
            </h3>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.8 }}>
              Premium footwear for those who live with intention. Nairobi-born,
              globally inspired.
            </p>
          </div>
          {[
            {
              title: "Shop",
              links: ["All Products", "New Arrivals", "Sale", "Wishlist"],
              hrefs: ["/shop", "/launch", "/shop", "/wishlist"],
            },
            {
              title: "Account",
              links: ["My Orders", "Profile", "Login", "Sign Up"],
              hrefs: ["/orders", "/profile", "/auth", "/auth"],
            },
            {
              title: "Info",
              links: ["About Us", "Contact", "Returns", "Privacy"],
              hrefs: ["/about", "/contact", "/returns", "/privacy"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "1rem",
                }}
              >
                {col.title}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((l, i) => (
                  <li key={l} style={{ marginBottom: "0.55rem" }}>
                    <Link
                      to={col.hrefs[i]}
                      style={{
                        color: "#6B5B45",
                        textDecoration: "none",
                        fontSize: "0.84rem",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#E8D5B7")}
                      onMouseLeave={(e) => (e.target.style.color = "#6B5B45")}
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid #2a1f10",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "0.75rem",
          }}
        >
          <p>© {new Date().getFullYear()} MAYSHOE. All rights reserved.</p>
          <p style={{ color: "#C9A84C" }}>Nairobi, Kenya</p>
        </div>
      </footer>

      {/* ── KEYFRAMES ───────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.6; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.15); }
        }
      `}</style>
    </div>
  );
}