"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import AddToCartButton from "./AddToCartButton";
import { formatCurrency } from "./CartProvider";

function getVariantCartId(productId, dosage) {
  const dosageKey = dosage
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${productId}-${dosageKey}`;
}

const ICON_GRADIENTS = [
  "from-[#e8841a] to-[#f6b56a]",
  "from-[#0f5a72] to-[#3fc1d6]",
  "from-[#7c3aed] to-[#c4a6fb]",
  "from-[#059669] to-[#5eead4]",
  "from-[#dc2626] to-[#fb923c]",
  "from-[#2563eb] to-[#7dd3fc]",
];

function getIconGradient(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ICON_GRADIENTS[hash % ICON_GRADIENTS.length];
}

function ProductCard({ product }) {
  const router = useRouter();
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

  const detailHref = `/product/${product.id}`;
  const gradient = getIconGradient(product.category || product.drugName);

  return (
    <article
      onClick={() => router.push(detailHref)}
      className="group relative flex h-full min-h-[540px] cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.38)] transition duration-300 hover:-translate-y-1.5 hover:border-[#e8841a] hover:shadow-[0_32px_80px_-38px_rgba(232,132,26,0.32)]"
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-[0.12] blur-2xl`}
        aria-hidden="true"
      />

      <Link
        href={detailHref}
        className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-[0_14px_30px_-14px_rgba(15,23,42,0.55)] transition-transform duration-300 group-hover:scale-105`}
      >
        <FaPrescriptionBottleAlt className="h-7 w-7" aria-hidden="true" />
      </Link>

      <span className="mt-4 inline-flex w-fit rounded-full bg-[#eef7fb] px-3 py-1 text-xs font-semibold text-[#0f5a72]">
        {product.condition || product.category}
      </span>

      <Link href={detailHref}>
        <h3 className="mt-3 line-clamp-2 min-h-[3.6rem] text-xl font-semibold leading-tight tracking-tight text-slate-950 group-hover:text-[#e8841a] sm:text-2xl">
          {product.name}
        </h3>
      </Link>
      <p className="mt-1 line-clamp-1 text-sm font-semibold leading-7 text-[#0f5a72]">
        Drug: {product.drugName}
      </p>

      <div onClick={(event) => event.stopPropagation()}>
        <label
          className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
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
      </div>

      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f5a72]">
        Valid prescription required
      </p>

      <div className="mt-auto pt-5">
        <p className="text-2xl font-semibold text-[#e8841a]">
          {formatCurrency(selectedProduct.price)}
        </p>

        <div onClick={(event) => event.stopPropagation()}>
          <AddToCartButton product={selectedProduct} className="mt-4 w-full" />
        </div>
        <Link
          href={detailHref}
          onClick={(event) => event.stopPropagation()}
          className="mt-3 inline-flex w-full items-center justify-center text-sm font-semibold text-[#0f5a72] underline-offset-2 hover:underline"
        >
          View details
        </Link>
      </div>
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
