import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LaunchPage() {
  const [loading, setLoading] = useState(true);

  const featuredProduct = {
    name: "Air Nova X1",
    price: "KES 6,500",
    description:
      "A premium street sneaker designed for comfort, durability, and modern style. Perfect for daily wear and urban fashion.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-center">
          <div className="h-10 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold">MAYSHOE</h1>
        <div className="space-x-6">
          <a href="/shop" className="hover:text-gray-300">Shop</a>
          <a href="/about" className="hover:text-gray-300">About</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-4"
        >
          Step Into Style
        </motion.h1>

        <p className="text-gray-300 max-w-xl mb-8">
          Discover premium sneakers and streetwear designed for comfort, style,
          and confidence.
        </p>

        <motion.a
          href="/shop"
          whileHover={{ scale: 1.05 }}
          className="bg-white text-black px-6 py-3 rounded-full font-semibold"
        >
          Explore Shop
        </motion.a>
      </div>

      {/* New Launch Section */}
      <div className="mt-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">🔥 New Launch</h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white text-black max-w-4xl mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
        >
          <img
            src={featuredProduct.image}
            alt={featuredProduct.name}
            className="w-full md:w-1/2 object-cover"
          />

          <div className="p-8 flex flex-col justify-center text-left">
            <h3 className="text-2xl font-bold mb-2">
              {featuredProduct.name}
            </h3>
            <p className="text-gray-600 mb-4">
              {featuredProduct.description}
            </p>
            <p className="text-xl font-semibold mb-6">
              {featuredProduct.price}
            </p>

            <div className="flex gap-4">
              <a
                href="/shop"
                className="bg-black text-white px-5 py-2 rounded-full"
              >
                View Product
              </a>
              <a
                href="/shop"
                className="border border-black px-5 py-2 rounded-full"
              >
                Buy Now
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
