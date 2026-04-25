"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCartButton({ product, className = "" }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setJustAdded(false);
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [justAdded]);

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className={`mt-6 inline-flex rounded-full bg-[#e8841a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#cf6f0b] ${className}`}
    >
      {justAdded ? "Added to cart" : "Add to Cart"}
    </button>
  );
}
