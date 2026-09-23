'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useCart } from "./CartProvider";
import products from "../data/products.json";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "How to Order", href: "/#how-to-order" },
  { label: "Rx Products", href: "/#rx-products" },
  { label: "Featured", href: "/#featured" },
  { label: "FAQ", href: "/#faq" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Compliance", href: "/compliance" },
];

function productMatchesQuery(product, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return false;
  }

  return [product.drugName, product.brandName, product.name].some((value) =>
    value?.toLowerCase().includes(normalizedQuery),
  );
}

function SearchForm({ className = "", onSearch }) {
  const router = useRouter();
  const searchId = useId();
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();

  const suggestions = useMemo(() => {
    if (trimmedQuery.length < 2) {
      return [];
    }

    return products.filter((product) => productMatchesQuery(product, trimmedQuery)).slice(0, 6);
  }, [trimmedQuery]);

  function submitSearch(event) {
    event.preventDefault();

    if (!trimmedQuery) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    onSearch?.();
    setQuery("");
  }

  return (
    <form className={`relative ${className}`} onSubmit={submitSearch}>
      <label className="sr-only" htmlFor={searchId}>
        Search by drug or brand name
      </label>
      <div className="flex h-11 items-center rounded-full border border-orange-200 bg-white px-4 shadow-[0_12px_30px_-26px_rgba(232,132,26,0.7)] transition focus-within:border-[#E8841A] focus-within:ring-2 focus-within:ring-orange-100">
        <FiSearch className="h-4 w-4 shrink-0 text-[#E8841A]" aria-hidden="true" />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search drug or brand"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="rounded-full bg-[#E8841A] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#cf6f0b]"
        >
          Search
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_24px_70px_-34px_rgba(15,23,42,0.45)]">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              href={`/search?q=${encodeURIComponent(product.brandName || product.name)}`}
              onClick={() => {
                onSearch?.();
                setQuery("");
              }}
              className="block px-4 py-3 text-left transition hover:bg-orange-50"
            >
              <span className="block text-sm font-semibold text-slate-950">
                {product.brandName || product.name}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-[#0f5a72]">
                Drug: {product.drugName}
              </span>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}

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

        <SearchForm className="hidden min-w-[260px] max-w-md flex-1 md:block" />

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

      <div className="border-b border-orange-100 bg-white px-4 py-3 md:hidden">
        <SearchForm />
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
