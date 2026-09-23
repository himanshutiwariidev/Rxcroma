"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiShoppingCart } from "react-icons/fi";
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
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#e8841a] px-6 text-sm font-semibold text-white transition hover:bg-[#cf6f0b] ${className}`}
    >
      {justAdded ? (
        <>
          <FiCheck className="h-4 w-4" aria-hidden="true" />
          Added to cart
        </>
      ) : (
        <>
          <FiShoppingCart className="h-4 w-4" aria-hidden="true" />
          Add to Cart
        </>
      )}
    </button>
  );
}
