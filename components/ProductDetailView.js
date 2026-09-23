"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle, FiMessageCircle, FiPhoneCall, FiShield, FiTruck } from "react-icons/fi";
import AddToCartButton from "./AddToCartButton";
import { formatCurrency } from "./CartProvider";

const WHATSAPP_NUMBER = "12349998888";
const ENQUIRY_EMAIL = "support@Rxcroma.com";

function getVariantCartId(productId, dosage) {
  const dosageKey = dosage
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${productId}-${dosageKey}`;
}

export default function ProductDetailView({ product }) {
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

  const enquiryMessage = `Hi, I would like to enquire about ${product.name} (${selectedVariant.dosage}, ${formatCurrency(selectedVariant.price)}). Please share more details.`;

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiryMessage)}`;
  const mailtoHref = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(
    `Enquiry: ${product.name}`,
  )}&body=${encodeURIComponent(enquiryMessage)}`;

  const tags = [product.category, product.subCategory, product.condition].filter(Boolean);

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div className="lg:sticky lg:top-8">
        <div className="flex aspect-square w-full items-center justify-center rounded-[2rem] border border-orange-100 bg-[#fffaf5] shadow-[0_24px_60px_-38px_rgba(232,132,26,0.35)]">
          <span className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white text-4xl font-bold text-[#e8841a] shadow-[0_14px_30px_-24px_rgba(232,132,26,0.7)]">
            {product.label}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <FiShield className="mx-auto h-5 w-5 text-[#e8841a]" aria-hidden="true" />
            <p className="mt-1.5 text-[11px] font-semibold leading-tight text-slate-600">
              Genuine Medicine
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <FiTruck className="mx-auto h-5 w-5 text-[#e8841a]" aria-hidden="true" />
            <p className="mt-1.5 text-[11px] font-semibold leading-tight text-slate-600">
              Tracked Shipping
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <FiCheckCircle className="mx-auto h-5 w-5 text-[#e8841a]" aria-hidden="true" />
            <p className="mt-1.5 text-[11px] font-semibold leading-tight text-slate-600">
              Pharmacist Verified
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#eef7fb] px-3 py-1 text-xs font-semibold text-[#0f5a72]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-base font-semibold text-[#0f5a72]">Drug: {product.drugName}</p>

        <p className="mt-6 text-base leading-8 text-slate-600">{product.description}</p>

        <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.28)]">
          <label
            className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
            htmlFor={`detail-dosage-${product.id}`}
          >
            Select strength / pack size
          </label>
          <select
            id={`detail-dosage-${product.id}`}
            value={selectedDosage}
            onChange={(event) => setSelectedDosage(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#e8841a] focus:ring-2 focus:ring-orange-100"
          >
            {variants.map((variant) => (
              <option key={variant.dosage} value={variant.dosage}>
                {variant.dosage}
              </option>
            ))}
          </select>

          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f5a72]">
            Valid prescription required
          </p>

          <p className="mt-4 text-3xl font-semibold text-[#e8841a]">
            {formatCurrency(selectedProduct.price)}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton product={selectedProduct} />
            <a
              href={mailtoHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#e8841a] px-6 text-sm font-semibold text-[#e8841a] transition hover:bg-[#fff7ee]"
            >
              <FiPhoneCall className="h-4 w-4" aria-hidden="true" />
              Enquire Now
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
            >
              <FiMessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp Now
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {variants.map((variant) => (
            <div
              key={variant.dosage}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                variant.dosage === selectedDosage
                  ? "border-[#e8841a] bg-[#fff7ee] text-[#e8841a]"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              <span>{variant.dosage}</span>
              <span>{formatCurrency(variant.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
