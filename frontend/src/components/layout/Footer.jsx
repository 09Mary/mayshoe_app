import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const SOCIAL_ICONS = [Instagram, Twitter, Facebook, Youtube];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-playfair text-xl font-bold">SOLE</span>
              <span className="font-playfair text-xl font-light text-primary">STUDIO</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              Crafted for those who walk boldly. Every step, a statement.
            </p>
            <div className="flex gap-4">
              {SOCIAL_ICONS.map((SocialIcon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <SocialIcon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-background/90 uppercase tracking-wide text-xs">Shop</h4>
            <ul className="space-y-2.5">
              {["All Shoes", "New Launches", "Sneakers", "Boots", "Sandals"].map(l => (
                <li key={l}>
                  <Link to="/shop" className="text-background/60 hover:text-background text-sm transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-background/90 uppercase tracking-wide text-xs">Help</h4>
            <ul className="space-y-2.5">
              {["Size Guide", "Shipping Info", "Returns", "FAQs", "Contact Us"].map(l => (
                <li key={l}>
                  <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-background/90 uppercase tracking-wide text-xs">About</h4>
            <ul className="space-y-2.5">
              {["Our Story", "Sustainability", "Careers", "Press", "Blog"].map(l => (
                <li key={l}>
                  <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-sm">© 2025 Sole Studio. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
              <a key={l} href="#" className="text-background/40 hover:text-background/80 text-xs transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}