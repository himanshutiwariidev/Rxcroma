"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";
import { formatCurrency, useCart } from "../../components/CartProvider";

const shippingFee = 0;

export default function CheckoutPage() {
  const { cartItems, clearCart, isReady, removeFromCart, subtotal, updateQuantity } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    address: "",
    city: "",
    email: "",
    fullName: "",
    notes: "",
    phone: "",
    state: "",
    zipCode: "",
  });
  const [hasValidPrescription, setHasValidPrescription] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const orderTotal = useMemo(() => subtotal + shippingFee, [subtotal]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((currentDetails) => ({
      ...currentDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasValidPrescription || !prescriptionFile) {
      return;
    }
    setIsSubmitted(true);
    clearCart();
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7f0_0%,#ffffff_26%,#fffaf4_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#e8841a]">Checkout</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Review your cart and enter your contact details
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            This checkout is ready for cart review and customer intake. In the next step, we can
            connect this form to Nodemailer for order notifications.
          </p>
        </div>

        {!isReady ? (
          <div className="mt-12 rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(232,132,26,0.3)]">
            <p className="text-lg font-medium text-slate-700">Loading your cart...</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(232,132,26,0.3)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-950">Order summary</h2>
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm font-semibold text-[#e8841a] transition hover:text-[#cf6f0b]"
                  >
                    Clear cart
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="mt-8 rounded-[1.5rem] border border-dashed border-orange-200 bg-[#fff8f1] p-8">
                  <p className="text-lg font-medium text-slate-700">Your cart is empty right now.</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Add products from the homepage and they will appear here instantly.
                  </p>
                  <Link
                    href="/#featured"
                    className="mt-6 inline-flex rounded-full bg-[#e8841a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf6f0b]"
                  >
                    Browse products
                  </Link>
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  {cartItems.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xl font-semibold text-slate-950">{item.name}</p>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{item.dosage}</p>
                          <p className="mt-2 text-base font-semibold text-[#e8841a]">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="text-sm font-medium text-slate-600" htmlFor={`qty-${item.id}`}>
                            Qty
                          </label>
                          <input
                            id={`qty-${item.id}`}
                            min="1"
                            type="number"
                            value={item.quantity}
                            onChange={(event) =>
                              updateQuantity(item.id, Number(event.target.value) || 1)
                            }
                            className="w-20 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-[#e8841a]"
                          />
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm font-semibold text-slate-500 transition hover:text-[#cf6f0b]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 border-t border-slate-200 pt-4 text-right text-base font-semibold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(232,132,26,0.3)]">
              <h2 className="text-2xl font-semibold text-slate-950">Customer details</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Fill this out to place an order request. Prescription medication orders require valid
                prescription verification before processing.
              </p>

              {isSubmitted ? (
                <div className="mt-8 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6">
                  <p className="text-lg font-semibold text-emerald-800">Checkout captured successfully.</p>
                  <p className="mt-2 text-sm leading-7 text-emerald-700">
                    Your cart has been cleared and the form is ready for the next step, where we
                    can send order details through Nodemailer.
                  </p>
                  <Link
                    href="/#featured"
                    className="mt-5 inline-flex rounded-full bg-[#e8841a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf6f0b]"
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="Full name"
                      name="fullName"
                      onChange={handleInputChange}
                      required
                      value={customerDetails.fullName}
                    />
                    <InputField
                      label="Email address"
                      name="email"
                      onChange={handleInputChange}
                      required
                      type="email"
                      value={customerDetails.email}
                    />
                    <InputField
                      label="Phone number"
                      name="phone"
                      onChange={handleInputChange}
                      required
                      value={customerDetails.phone}
                    />
                    <InputField
                      label="State"
                      name="state"
                      onChange={handleInputChange}
                      required
                      value={customerDetails.state}
                    />
                  </div>

                  <InputField
                    label="Street address"
                    name="address"
                    onChange={handleInputChange}
                    required
                    value={customerDetails.address}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="City"
                      name="city"
                      onChange={handleInputChange}
                      required
                      value={customerDetails.city}
                    />
                    <InputField
                      label="ZIP code"
                      name="zipCode"
                      onChange={handleInputChange}
                      required
                      value={customerDetails.zipCode}
                    />
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Order notes
                    </span>
                    <textarea
                      className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#e8841a]"
                      name="notes"
                      onChange={handleInputChange}
                      placeholder="Prescription notes, delivery instructions, or preferred contact times"
                      value={customerDetails.notes}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Upload prescription
                    </span>
                    <input
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#e8841a] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#cf6f0b] focus:border-[#e8841a]"
                      name="prescription"
                      onChange={(event) => setPrescriptionFile(event.target.files?.[0] || null)}
                      required
                      type="file"
                    />
                    <span className="mt-2 block text-xs leading-6 text-slate-500">
                      PDF, JPG, JPEG, or PNG prescription file is required.
                    </span>
                  </label>

                  <div className="rounded-[1.5rem] bg-[#fff8f1] p-5">
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-600">
                      <span>Shipping</span>
                      <span>{shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-orange-200 pt-4 text-lg font-semibold text-slate-950">
                      <span>Total</span>
                      <span>{formatCurrency(orderTotal)}</span>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-cyan-100 bg-[#f4fbff] p-5">
                    <p className="text-sm leading-7 text-slate-700">
                      Dispensing country/region will be disclosed before charge and order placement.
                      Current fulfillment network includes Canada, United Kingdom, and India (selected
                      products).
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      Patients with placed orders can request consultation with a licensed pharmacist.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-orange-100 bg-[#fff8f1] p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#e8841a]">
                      Payment
                    </p>
                    <label className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-200 bg-white p-4">
                      <input
                        defaultChecked
                        name="paymentMethod"
                        type="radio"
                        value="wire"
                        className="h-4 w-4 accent-[#e8841a]"
                      />
                      <span className="text-sm font-semibold text-slate-800">Wire payment</span>
                    </label>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      Only wire payments allowed.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                    <input
                      checked={hasValidPrescription}
                      onChange={(event) => setHasValidPrescription(event.target.checked)}
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[#e8841a]"
                    />
                    <span className="text-sm leading-7 text-slate-700">
                      I confirm I can provide a valid prescription for any prescription medication in
                      this order request.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={cartItems.length === 0 || !hasValidPrescription || !prescriptionFile}
                    className="inline-flex w-full justify-center rounded-full bg-[#e8841a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf6f0b] disabled:cursor-not-allowed disabled:bg-orange-200"
                  >
                    Place compliant order request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

function InputField({ label, name, onChange, required = false, type = "text", value }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#e8841a]"
        name={name}
        onChange={onChange}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
