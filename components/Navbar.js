'use client'
import Link from "next/link";
import { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useCart } from "./CartProvider";

const navLinks = [
  { label: "How to Order", href: "/#how-to-order" },
  { label: "Rx Products", href: "/#rx-products" },
  { label: "Featured", href: "/#featured" },
  { label: "FAQ", href: "/#faq" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Compliance", href: "/compliance" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isReady } = useCart();
  const cartCountLabel = isReady ? itemCount : 0;

  return (
    <header>
      {/* Top orange bar */}
      <div className="bg-[#E8841A] px-4 md:px-15 py-2 flex flex-wrap items-center font-semibold justify-between gap-2">
        {/* Phone numbers - hidden on small screens, shown on md+ */}
        <div className="hidden md:flex flex-wrap items-center gap-4 text-white text-sm">
          <span className="flex items-center gap-1.5">
            📞 1-234-999-8888 (Local US)
          </span>
          <span className="text-white/40">|</span>
          <span className="flex items-center gap-1.5">
            📞 1-222-704-000
          </span>
          <span className="text-white/40">|</span>
          <span className="flex items-center gap-1.5">
            🖨️ 1-800-888-9999 (Toll Free Fax)
          </span>
        </div>

        {/* On mobile: show only first phone number */}
        <div className="flex md:hidden items-center gap-1.5 text-white text-sm">
          📞 1-000-999-8688
        </div>

        {/* Right side links */}
        <div className="flex items-center gap-1 text-white text-sm">
          <Link href="/login" className="flex items-center gap-1.5 px-2 py-0.5 hover:opacity-80 transition">
            ➔ <span className="hidden sm:inline">Sign In</span>
          </Link>
          <span className="text-white/40">|</span>
          <Link href="/signup" className="flex items-center gap-1.5 px-2 py-0.5 hover:opacity-80 transition">
            <FaUser /> <span className="hidden sm:inline">Create Account</span>
          </Link>
          <span className="text-white/40">|</span>
          <Link href="/checkout" className="flex items-center gap-1.5 px-2 py-0.5 hover:opacity-80 transition">
            <FaCartPlus />
            <span className="hidden sm:inline">Cart</span>
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
              {cartCountLabel}
            </span>
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white border-b-2 border-[#E8841A] px-4 md:px-15 py-2.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl md:text-2xl font-bold text-slate-800">
            Rxcroma
          </Link>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex flex-wrap items-center">
          {navLinks.map((item, i) => {
            return (
              <span key={item.label} className="flex items-center">
                
                <Link href={item.href}
                  className="text-[#1a6e7a] text-sm font-bold uppercase tracking-wide px-3 hover:text-[#E8841A] transition"
                >
                  {item.label}
                </Link>
                {i < navLinks.length - 1 && (
                  <span className="text-gray-300 select-none">|</span>
                )}
              </span>
            );
          })}
        </nav>

        {/* Hamburger button - shown on mobile/tablet */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded border border-[#E8841A] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[#1a6e7a] transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#1a6e7a] transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#1a6e7a] transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-[#E8841A] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((item) => {
            return (
              
               <Link key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#1a6e7a] text-sm font-bold uppercase tracking-wide py-2.5 px-2 border-b border-gray-100 last:border-0 hover:text-[#E8841A] hover:bg-orange-50 rounded transition"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
