import { Link } from "react-router-dom";
import { ShoeCategories } from "../components/ShoeCategories";
import { NewLaunch } from "../components/NewLaunch";
import { TimelyShop } from "../components/TimelyShop";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 sticky top-0 bg-black/70 backdrop-blur-md z-50">
        <h1 className="text-2xl font-bold">MAYSHOE</h1>

        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/shop" className="hover:text-gray-300">Shop</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <h1 className="text-5xl font-bold mb-4">Step Into Style</h1>
        <p className="text-gray-300 max-w-xl mb-8">
          Discover premium sneakers and streetwear designed for comfort, style,
          and confidence.
        </p>

        <Link
          to="/shop"
          className="bg-white text-black px-6 py-3 rounded-full font-semibold"
        >
          Explore Shop
        </Link>
      </div>

      {/* Sections (imported components) */}
      <ShoeCategories />
      <NewLaunch />
      <TimelyShop />

      {/* Footer */}
      <footer className="mt-24 py-10 text-center text-gray-400 border-t border-gray-800">
        <p>© {new Date().getFullYear()} MAYSHOE. All rights reserved.</p>
      </footer>
    </div>
  );
}