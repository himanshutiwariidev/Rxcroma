"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { formatCurrency } from "./CartProvider";

function getVariantCartId(productId, dosage) {
  const dosageKey = dosage
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${productId}-${dosageKey}`;
}

function ProductCard({ product }) {
  const variants = product.variants?.length
    ? product.variants
    : [{ dosage: product.dosage, price: product.price }];
  const [selectedDosage, setSelectedDosage] = useState(variants[0]?.dosage || product.dosage);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.dosage === selectedDosage) || variants[0],
    [selectedDosage, variants],
  );

  const selectedProduct = {
    ...product,
    id: getVariantCartId(product.id, selectedVariant.dosage),
    productId: product.id,
    dosage: selectedVariant.dosage,
    price: selectedVariant.price ?? product.price,
  };

  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.38)] transition hover:border-[#e8841a] hover:shadow-[0_32px_80px_-38px_rgba(232,132,26,0.28)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4e8] text-lg font-bold text-[#e8841a]">
        {product.label}
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
        {product.name}
      </h3>
      <p className="mt-1 text-sm font-semibold leading-7 text-[#0f5a72]">
        Drug: {product.drugName}
      </p>
      <label
        className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
        htmlFor={`dosage-${product.id}`}
      >
        Select strength
      </label>
      <select
        id={`dosage-${product.id}`}
        value={selectedDosage}
        onChange={(event) => setSelectedDosage(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#e8841a] focus:ring-2 focus:ring-orange-100"
      >
        {variants.map((variant) => (
          <option key={variant.dosage} value={variant.dosage}>
            {variant.dosage}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f5a72]">
        Valid prescription required
      </p>
      <p className="mt-5 text-xl font-semibold text-[#e8841a]">
        {formatCurrency(selectedProduct.price)}
      </p>
      <AddToCartButton product={selectedProduct} />
    </article>
  );
}

export default function FeaturedProductsGrid({ products }) {
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
