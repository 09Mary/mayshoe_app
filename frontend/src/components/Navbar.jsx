import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, isStaff } from "../utils/auth";

function Navbar({ cartCount, isLoggedIn, setIsLoggedIn, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect if we're on the home page (hero has dark bg so navbar should be transparent)
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Load Playfair if not already loaded
    if (!document.getElementById("playfair-font")) {
      const link = document.createElement("link");
      link.id = "playfair-font";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@300;400;500&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/");
  };

  // On home page, nav is transparent until scrolled
  const bg =
    isHome && !scrolled
      ? "transparent"
      : "rgba(250,247,242,0.97)";

  const textColor =
    isHome && !scrolled ? "#FAF7F2" : "#1A1208";

  const borderBottom =
    isHome && !scrolled ? "none" : "1px solid #E8D5B7";

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: bg,
          borderBottom,
          backdropFilter: scrolled || !isHome ? "blur(12px)" : "none",
          transition: "background 0.35s ease, border-color 0.35s ease",
          padding: "0 2rem",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: isHome && !scrolled ? "#FAF7F2" : "#1A1208",
            textDecoration: "none",
            letterSpacing: "0.04em",
            transition: "color 0.3s",
          }}
        >
          MAYSHOE
        </Link>

        {/* ── Desktop nav links ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            fontSize: "0.8rem",
            fontWeight: 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {[
            { label: "Home", to: "/" },
            { label: "Shop", to: "/shop" },
            { label: "New In", to: "/launch" },
            ...(isLoggedIn ? [{ label: "Wishlist", to: "/wishlist" }] : []),
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                color: textColor,
                textDecoration: "none",
                opacity: location.pathname === to ? 1 : 0.75,
                borderBottom:
                  location.pathname === to
                    ? "1px solid #C9A84C"
                    : "1px solid transparent",
                paddingBottom: "2px",
                transition: "opacity 0.2s, border-color 0.2s, color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "1")}
              onMouseLeave={(e) =>
                (e.target.style.opacity =
                  location.pathname === to ? "1" : "0.75")
              }
            >
              {label}
            </Link>
          ))}

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              position: "relative",
              color: textColor,
              textDecoration: "none",
              opacity: 0.85,
              letterSpacing: "0.12em",
              transition: "color 0.3s",
            }}
          >
            Cart
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-12px",
                  background: "#C9A84C",
                  color: "#1A1208",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth section */}
          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {user && (
                <span
                  style={{
                    color: textColor,
                    opacity: 0.6,
                    fontSize: "0.75rem",
                    fontFamily: "'Inter', sans-serif",
                    fontStyle: "italic",
                    textTransform: "none",
                    letterSpacing: "0",
                  }}
                >
                  {user.username}
                </span>
              )}
              <Link
                to="/orders"
                style={{ color: textColor, textDecoration: "none", opacity: 0.75, transition: "color 0.3s" }}
              >
                Orders
              </Link>
              <Link
                to="/profile"
                style={{ color: textColor, textDecoration: "none", opacity: 0.75, transition: "color 0.3s" }}
              >
                Profile
              </Link>
              {isStaff() && (
                <Link
                  to="/admin-dashboard"
                  style={{
                    color: "#C9A84C",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: textColor,
                  opacity: 0.75,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                  padding: 0,
                  transition: "opacity 0.2s",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <Link
                to="/auth"
                style={{ color: textColor, textDecoration: "none", opacity: 0.75, transition: "color 0.3s" }}
              >
                Login
              </Link>
              <Link
                to="/auth"
                style={{
                  background: "#C9A84C",
                  color: "#1A1208",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "2px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#b8943e")}
                onMouseLeave={(e) => (e.target.style.background = "#C9A84C")}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed nav on non-home pages */}
      {!isHome && <div style={{ height: "68px" }} />}
    </>
  );
}

export default Navbar;