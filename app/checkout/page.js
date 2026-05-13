"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";
import { formatCurrency, useCart } from "../../components/CartProvider";

const shippingFee = 0;

const FIELD_STYLE =
  "w-full rounded-xl border border-[#e8d5c0] bg-[#fdfaf7] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#c8701a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(200,112,26,0.08)]";

const LABEL_STYLE = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500";

const COUNTRY_API_URL = "https://restcountries.com/v3.1/all?fields=name,cca2,idd";

const PHONE_PATTERN = "^\\+?[0-9][0-9\\s().-]{5,24}$";
const PHONE_TITLE = "Use an international phone number, preferably with country code.";
const POSTAL_PATTERN = "^([A-Z0-9][A-Z0-9\\s-]{1,14}|N/?A)$";
const POSTAL_TITLE = "Use your postal/ZIP code, or N/A if your address does not use one.";

const FALLBACK_COUNTRY_OPTIONS = [
  {
    label: "United States (USA)",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+1 (555) 000-0000",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "10001",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "California",
    dialCode: "+1",
    value: "US",
  },
  {
    label: "United Kingdom (UK)",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+44 20 7946 0958",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "SW1A 1AA",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "Greater London",
    dialCode: "+44",
    value: "GB",
  },
  {
    label: "Canada",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+1 (416) 555-0123",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "M5V 3L9",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "Ontario",
    dialCode: "+1",
    value: "CA",
  },
  {
    label: "India",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+91 98765 43210",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "110001",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "Delhi",
    dialCode: "+91",
    value: "IN",
  },
  {
    label: "United Arab Emirates",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+971 50 123 4567",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "N/A",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "Dubai",
    dialCode: "+971",
    value: "AE",
  },
  {
    label: "Australia",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+61 412 345 678",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "2000",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "New South Wales",
    dialCode: "+61",
    value: "AU",
  },
  {
    label: "Germany",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+49 30 123456",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "10115",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "Berlin",
    dialCode: "+49",
    value: "DE",
  },
  {
    label: "Japan",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+81 90 1234 5678",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "100-0001",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "Tokyo",
    dialCode: "+81",
    value: "JP",
  },
  {
    label: "France",
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: "+33 1 23 45 67 89",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "75001",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "Ile-de-France",
    dialCode: "+33",
    value: "FR",
  },
];

const REQUIRED_CONTACT_FIELDS = ["fullName", "email", "country", "phone", "address", "city", "state", "zipCode"];
const REQUIRED_PATIENT_FIELDS = ["age", "bodyWeight", "gender", "diseases", "allergies"];

function buildCountryOption(country) {
  const dialCode = [country.idd?.root, country.idd?.suffixes?.[0]].filter(Boolean).join("");

  return {
    dialCode,
    label: country.name?.common || country.cca2,
    phonePattern: PHONE_PATTERN,
    phonePlaceholder: dialCode ? `${dialCode} phone number` : "+1 555 000 0000",
    phoneTitle: PHONE_TITLE,
    postalLabel: "Postal / ZIP code",
    postalPattern: POSTAL_PATTERN,
    postalPlaceholder: "Postal code or N/A",
    postalTitle: POSTAL_TITLE,
    regionLabel: "State / Province / Region",
    regionPlaceholder: "Region",
    value: country.cca2,
  };
}

function getCountrySettings(country, countryOptions) {
  return countryOptions.find((option) => option.value === country) || countryOptions[0];
}

export default function CheckoutPage() {
  const { cartItems, clearCart, isReady, removeFromCart, subtotal, updateQuantity } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeSection, setActiveSection] = useState("contact");
  const [countryOptions, setCountryOptions] = useState(FALLBACK_COUNTRY_OPTIONS);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    address: "",
    age: "",
    allergies: "",
    bodyWeight: "",
    city: "",
    country: "US",
    countryDialCode: "+1",
    countryName: "United States",
    currentMedicines: "",
    diseases: "",
    emergencyContact: "",
    email: "",
    fullName: "",
    gender: "",
    height: "",
    notes: "",
    phone: "",
    pregnancyStatus: "",
    prescriptionHistory: "",
    state: "",
    zipCode: "",
  });
  const [hasValidPrescription, setHasValidPrescription] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const orderTotal = useMemo(() => subtotal + shippingFee, [subtotal]);
  const selectedCountry = getCountrySettings(customerDetails.country, countryOptions);
  const hasContactDetails = Boolean(
    REQUIRED_CONTACT_FIELDS.every((field) => customerDetails[field]?.trim()),
  );
  const hasPatientDetails = Boolean(REQUIRED_PATIENT_FIELDS.every((field) => customerDetails[field]?.trim()));
  const canPlaceOrder =
    hasContactDetails &&
    hasPatientDetails &&
    cartItems.length > 0 &&
    hasValidPrescription &&
    prescriptionFile &&
    !isSubmitting;

  useEffect(() => {
    let ignore = false;

    async function loadCountries() {
      try {
        const response = await fetch(COUNTRY_API_URL);
        if (!response.ok) {
          throw new Error("Unable to load countries");
        }

        const countries = await response.json();
        const options = countries
          .filter((country) => country.cca2 && country.name?.common)
          .map(buildCountryOption)
          .sort((a, b) => a.label.localeCompare(b.label));

        if (ignore || options.length === 0) return;

        setCountryOptions(options);
        setCustomerDetails((details) => {
          const currentCountry = options.find((option) => option.value === details.country);

          return currentCountry
            ? {
                ...details,
                countryDialCode: currentCountry.dialCode,
                countryName: currentCountry.label,
              }
            : details;
        });
      } catch {
        if (!ignore) {
          setCountryOptions(FALLBACK_COUNTRY_OPTIONS);
        }
      } finally {
        if (!ignore) {
          setIsLoadingCountries(false);
        }
      }
    }

    loadCountries();

    return () => {
      ignore = true;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((d) => ({ ...d, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const { value } = e.target;
    const nextCountry = getCountrySettings(value, countryOptions);
    setCustomerDetails((d) => ({
      ...d,
      country: value,
      countryDialCode: nextCountry.dialCode,
      countryName: nextCountry.label,
      phone: "",
      state: "",
      zipCode: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasValidPrescription || !prescriptionFile || cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (!hasContactDetails) {
        setActiveSection("contact");
        throw new Error("Please complete the required contact details.");
      }

      const phoneRegex = new RegExp(selectedCountry.phonePattern, "i");
      const postalRegex = new RegExp(selectedCountry.postalPattern, "i");

      if (!phoneRegex.test(customerDetails.phone.trim())) {
        setActiveSection("contact");
        throw new Error(selectedCountry.phoneTitle);
      }

      if (!postalRegex.test(customerDetails.zipCode.trim())) {
        setActiveSection("contact");
        throw new Error(selectedCountry.postalTitle);
      }

      if (!hasPatientDetails) {
        setActiveSection("patient");
        throw new Error("Please complete the required medical profile fields.");
      }

      const formData = new FormData();
      formData.append("customerDetails", JSON.stringify(customerDetails));
      formData.append("items", JSON.stringify(cartItems));
      formData.append("orderTotal", String(orderTotal));
      formData.append("prescription", prescriptionFile);

      const response = await fetch("/api/checkout", {
        body: formData,
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit checkout right now.");
      }

      setIsSubmitted(true);
      clearCart();
    } catch (error) {
      setSubmitError(error.message || "Unable to submit checkout right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setPrescriptionFile(file);
  };

  const sections = [
    { id: "contact", label: "Contact", shortLabel: "Contact" },
    { id: "patient", label: "Medical", shortLabel: "Medical" },
    { id: "prescription", label: "Prescription", shortLabel: "Rx" },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf8f5] text-slate-900" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-fade-up { animation: fadeUp 0.5s ease both; }
        .animate-fade-up-1 { animation: fadeUp 0.5s ease 0.1s both; }
        .animate-fade-up-2 { animation: fadeUp 0.5s ease 0.2s both; }
        .animate-fade-up-3 { animation: fadeUp 0.5s ease 0.3s both; }

        .section-tab.active { background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; }
        .section-content { display: none; }
        .section-content.active { display: block; animation: fadeUp 0.35s ease both; }

        .cart-item { transition: all 0.2s ease; }
        .cart-item:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(200,112,26,0.08); }

        .submit-btn { background: linear-gradient(135deg, #c8701a 0%, #e8841a 50%, #c8701a 100%); background-size: 200% auto; transition: background-position 0.4s ease, transform 0.15s ease, box-shadow 0.15s ease; }
        .submit-btn:hover:not(:disabled) { background-position: right center; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(200,112,26,0.35); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { background: #e5d5c8; color: #b09080; cursor: not-allowed; }

        .file-drop { transition: all 0.2s ease; }
        .file-drop.drag-over { border-color: #c8701a; background: #fff8f1; }

        .progress-line { background: linear-gradient(90deg, #c8701a, #e8a050); }
        .check-icon { animation: fadeUp 0.3s ease both; }

        input[type=number]::-webkit-inner-spin-button { opacity: 0.5; }

        .pill-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
      `}</style>

      <TopBar />
      <Navbar />

      {/* Hero bar */}
      <div className="border-b border-[#ede8e2] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8701a]">Secure Checkout</p>
              <h1 className="display-font mt-1 text-3xl font-light text-slate-900 sm:text-4xl">
                Complete Your Order
              </h1>
            </div>
            <div className="hidden items-center gap-6 text-xs text-slate-500 sm:flex">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#c8701a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                SSL Encrypted
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#c8701a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Licensed Pharmacy
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#c8701a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                Free Shipping
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {!isReady ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e8d5c0] border-t-[#c8701a]" />
              <p className="mt-4 text-sm text-slate-500">Loading your cart…</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

            {/* LEFT — Form */}
            <div className="animate-fade-up space-y-6">

              {isSubmitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="display-font mt-4 text-2xl font-light text-emerald-900">Order Request Submitted</h2>
                  <p className="mt-2 text-sm leading-7 text-emerald-700">Your order has been captured. Our pharmacists will review your prescription and contact you within 24 hours.</p>
                  <Link href="/#featured" className="mt-6 inline-flex rounded-full bg-[#c8701a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b05c0e]">
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit} className="space-y-6">

                  {/* Section tabs */}
                  <div className="grid w-full overflow-hidden rounded-xl bg-[#f0ece6] p-1" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveSection(s.id)}
                        style={{ fontSize: "14px", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        className={`section-tab w-full rounded-lg px-0 py-2.5 font-semibold uppercase transition-all duration-200 ${activeSection === s.id ? "active text-[#c8701a]" : "text-slate-500"}`}
                      >
                        <span className="sm:hidden">{s.shortLabel}</span>
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Contact section */}
                  <div className={`section-content ${activeSection === "contact" ? "active" : ""}`}>
                    <div className="rounded-2xl border border-[#e8d5c0] bg-white p-6 shadow-sm">
                      <SectionHeader icon="👤" title="Contact Information" subtitle="Your delivery and communication details" />
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <InputField label="Full name" name="fullName" onChange={handleInputChange} required value={customerDetails.fullName} />
                        <InputField label="Email address" name="email" type="email" onChange={handleInputChange} required value={customerDetails.email} />
                        <SelectField label="Country" name="country" onChange={handleCountryChange} required value={customerDetails.country}>
                          {countryOptions.map((country) => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </SelectField>
                        <InputField
                          inputMode="tel"
                          label="Phone number"
                          name="phone"
                          onChange={handleInputChange}
                          pattern={selectedCountry.phonePattern}
                          placeholder={selectedCountry.phonePlaceholder}
                          required
                          title={selectedCountry.phoneTitle}
                          value={customerDetails.phone}
                        />
                      </div>
                      <div className="mt-4">
                        <InputField label="Street address" name="address" onChange={handleInputChange} required value={customerDetails.address} placeholder="123 Main St, Apt 4B" />
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <InputField label="City" name="city" onChange={handleInputChange} required value={customerDetails.city} />
                        <InputField label={selectedCountry.regionLabel} name="state" onChange={handleInputChange} placeholder={selectedCountry.regionPlaceholder} required value={customerDetails.state} />
                        <InputField
                          autoCapitalize="characters"
                          inputMode={customerDetails.country === "US" ? "numeric" : "text"}
                          label={selectedCountry.postalLabel}
                          name="zipCode"
                          onChange={handleInputChange}
                          pattern={selectedCountry.postalPattern}
                          placeholder={selectedCountry.postalPlaceholder}
                          required
                          title={selectedCountry.postalTitle}
                          value={customerDetails.zipCode}
                        />
                      </div>
                      {isLoadingCountries && (
                        <p className="mt-3 text-xs text-slate-400">Loading worldwide country list...</p>
                      )}
                      <div className="mt-5 flex justify-end">
                        <button type="button" onClick={() => setActiveSection("patient")} className="inline-flex items-center gap-2 rounded-full bg-[#c8701a] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#b05c0e]">
                          Next: Medical info
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Patient section */}
                  <div className={`section-content ${activeSection === "patient" ? "active" : ""}`}>
                    <div className="rounded-2xl border border-[#e8d5c0] bg-white p-6 shadow-sm">
                      <SectionHeader icon="🩺" title="Patient Medical Profile" subtitle="Helps pharmacists verify dosage safety and prescription requirements" />
                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <InputField label="Age" name="age" type="number" min="0" onChange={handleInputChange} required value={customerDetails.age} placeholder="e.g. 34" />
                        <InputField label="Body weight" name="bodyWeight" onChange={handleInputChange} required value={customerDetails.bodyWeight} placeholder="e.g. 72 kg" />
                        <InputField label="Height" name="height" onChange={handleInputChange} value={customerDetails.height} placeholder="e.g. 170 cm" />
                        <SelectField label="Gender" name="gender" onChange={handleInputChange} required value={customerDetails.gender}>
                          <option value="">Select</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </SelectField>
                      </div>
                      <div className="mt-4 space-y-4">
                        <TextAreaField label="Diseases or medical conditions" name="diseases" onChange={handleInputChange} required value={customerDetails.diseases} placeholder="Diabetes, thyroid, heart disease, kidney/liver disease, asthma, etc." />
                        <TextAreaField label="Known allergies" name="allergies" onChange={handleInputChange} required value={customerDetails.allergies} placeholder="Medication, food, or environmental allergies. Write 'none' if not applicable." />
                        <TextAreaField label="Current medications or supplements" name="currentMedicines" onChange={handleInputChange} value={customerDetails.currentMedicines} placeholder="Include dose and frequency if known." />
                        <TextAreaField label="Prescription history" name="prescriptionHistory" onChange={handleInputChange} value={customerDetails.prescriptionHistory} placeholder="Previous prescriptions, long-term therapies, or recent medicine changes." />
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <SelectField label="Pregnancy / breastfeeding" name="pregnancyStatus" onChange={handleInputChange} value={customerDetails.pregnancyStatus}>
                          <option value="">Select if applicable</option>
                          <option value="not-applicable">Not applicable</option>
                          <option value="pregnant">Pregnant</option>
                          <option value="breastfeeding">Breastfeeding</option>
                          <option value="planning-pregnancy">Planning pregnancy</option>
                        </SelectField>
                        <InputField label="Emergency contact" name="emergencyContact" onChange={handleInputChange} value={customerDetails.emergencyContact} placeholder="Name and phone number" />
                      </div>
                      <div className="mt-4">
                        <TextAreaField label="Order notes" name="notes" onChange={handleInputChange} value={customerDetails.notes} placeholder="Delivery instructions, preferred contact times, or additional notes." />
                      </div>
                      <div className="mt-5 flex justify-between">
                        <button type="button" onClick={() => setActiveSection("contact")} className="inline-flex items-center gap-2 rounded-full border border-[#e8d5c0] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-[#fdf6ee]">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                          Back
                        </button>
                        <button type="button" onClick={() => setActiveSection("prescription")} className="inline-flex items-center gap-2 rounded-full bg-[#c8701a] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#b05c0e]">
                          Next
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Prescription section */}
                  <div className={`section-content ${activeSection === "prescription" ? "active" : ""}`}>
                    <div className="rounded-2xl border border-[#e8d5c0] bg-white p-6 shadow-sm">
                      <SectionHeader icon="📋" title="Prescription Upload" subtitle="Required for all prescription medications. Accepted: PDF, JPG, JPEG, PNG." />

                      {/* Drop zone */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`file-drop mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${dragOver ? "drag-over border-[#c8701a] bg-[#fff8f1]" : "border-[#e8d5c0] bg-[#fdfaf7] hover:border-[#c8701a] hover:bg-[#fff8f1]"}`}
                      >
                        {prescriptionFile ? (
                          <div className="check-icon">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p className="mt-3 text-sm font-semibold text-slate-800">{prescriptionFile.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{(prescriptionFile.size / 1024).toFixed(1)} KB</p>
                            <button type="button" onClick={() => setPrescriptionFile(null)} className="mt-3 text-xs font-semibold text-[#c8701a] underline">
                              Remove and re-upload
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0e0]">
                              <svg className="h-6 w-6 text-[#c8701a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                            </div>
                            <p className="mt-3 text-sm font-semibold text-slate-700">Drop your prescription here</p>
                            <p className="mt-1 text-xs text-slate-400">or click to browse files</p>
                            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e8d5c0] px-5 py-2 text-xs font-semibold text-[#c8701a] transition hover:bg-[#fff0e0]">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                              Choose file
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="sr-only"
                                onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                              />
                            </label>
                          </>
                        )}
                      </div>

                      {/* Consent */}
                      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#e8d5c0] bg-[#fdfaf7] p-4 transition hover:bg-[#fff8f1]">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            checked={hasValidPrescription}
                            onChange={(e) => setHasValidPrescription(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${hasValidPrescription ? "border-[#c8701a] bg-[#c8701a]" : "border-[#e8d5c0] bg-white"}`}>
                            {hasValidPrescription && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm leading-6 text-slate-700">
                          I confirm I hold a valid prescription for all prescription medications in this order and consent to pharmacist verification before fulfillment.
                        </span>
                      </label>

                      {/* Fulfillment notice */}
                      <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 p-4">
                        <p className="text-xs leading-6 text-sky-700">
                          <strong className="font-semibold">Fulfillment network:</strong> Canada, United Kingdom, and India (selected products). Dispensing country will be confirmed before charge. Pharmacist consultation available upon request.
                        </p>
                      </div>

                      <div className="mt-5 flex justify-start">
                        <button type="button" onClick={() => setActiveSection("patient")} className="inline-flex items-center gap-2 rounded-full border border-[#e8d5c0] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-[#fdf6ee]">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                          Back
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment + Submit */}
                  <div className="rounded-2xl border border-[#e8d5c0] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Payment method</p>
                      <span className="pill-tag bg-[#fff0e0] text-[#c8701a]">Wire only</span>
                    </div>
                    <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#c8701a] bg-[#fff8f1] p-4">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#c8701a] bg-white">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#c8701a]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Wire transfer</p>
                        <p className="text-xs text-slate-500">Bank details provided after order confirmation</p>
                      </div>
                    </label>

                    <button
                      type="submit"
                      disabled={!canPlaceOrder}
                      className="submit-btn mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-2 py-3 text-sm font-semibold text-white"
                    >
                      {isSubmitting ? (
                        "Submitting order request..."
                      ) : canPlaceOrder ? (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                          Place compliant order request
                        </>
                      ) : (
                        "Complete all steps to place order"
                      )}
                    </button>

                    {!canPlaceOrder && (
                      <p className="mt-3 text-center text-xs text-slate-400">
                        {cartItems.length === 0 ? "Cart is empty · " : ""}
                        {!hasContactDetails ? "Contact details required · " : ""}
                        {!hasPatientDetails ? "Medical profile required · " : ""}
                        {!prescriptionFile ? "Prescription required · " : ""}
                        {!hasValidPrescription ? "Prescription consent required" : ""}
                      </p>
                    )}
                    {submitError && (
                      <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-xs font-semibold text-red-600">
                        {submitError}
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT — Order summary */}
            <div className="animate-fade-up-1 space-y-5">
              <div className="sticky top-6 space-y-5">

                {/* Cart */}
                <div className="rounded-2xl border border-[#e8d5c0] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="display-font text-xl font-light text-slate-900">Order Summary</h2>
                    {cartItems.length > 0 && (
                      <button type="button" onClick={clearCart} className="text-xs font-semibold text-slate-400 transition hover:text-red-500">
                        Clear all
                      </button>
                    )}
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="mt-5 rounded-xl border border-dashed border-[#e8d5c0] p-6 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e0]">
                        <svg className="h-5 w-5 text-[#c8701a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-700">Your cart is empty</p>
                      <Link href="/#featured" className="mt-3 inline-flex rounded-full bg-[#c8701a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#b05c0e]">
                        Browse products
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="cart-item rounded-xl border border-[#f0ece6] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                              <p className="mt-0.5 truncate text-xs text-slate-500">{item.dosage}</p>
                              <p className="mt-1 text-xs font-semibold text-[#c8701a]">{formatCurrency(item.price)} each</p>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="shrink-0 rounded-full p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-400">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-lg border border-[#e8d5c0] px-2 py-1">
                              <button type="button" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="flex h-5 w-5 items-center justify-center rounded text-slate-500 transition hover:bg-[#fff0e0] hover:text-[#c8701a]">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-5 w-5 items-center justify-center rounded text-slate-500 transition hover:bg-[#fff0e0] hover:text-[#c8701a]">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Totals */}
                  {cartItems.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-[#f0ece6] pt-4">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Shipping</span>
                        <span className="font-medium text-emerald-600">Free</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#f0ece6] pt-3 text-base font-semibold text-slate-900">
                        <span>Total</span>
                        <span className="text-[#c8701a]">{formatCurrency(orderTotal)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust badges */}
                <div className="rounded-2xl border border-[#e8d5c0] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Why trust LifeRx</p>
                  <div className="mt-3 space-y-3">
                    {[
                      { icon: "🔒", title: "End-to-end encryption", desc: "Your data is protected at all times" },
                      { icon: "👨‍⚕️", title: "Licensed pharmacists", desc: "Every order reviewed by a professional" },
                      { icon: "📦", title: "Global fulfillment", desc: "Canada, UK, and India networks" },
                    ].map((b) => (
                      <div key={b.title} className="flex items-start gap-3">
                        <span className="text-base">{b.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{b.title}</p>
                          <p className="text-xs text-slate-500">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress checklist */}
                <div className="rounded-2xl border border-[#e8d5c0] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Order checklist</p>
                  <div className="mt-3 space-y-2">
                    {[
                      { label: "Contact details", done: hasContactDetails },
                      { label: "Medical profile", done: hasPatientDetails },
                      { label: "Items in cart", done: cartItems.length > 0 },
                      { label: "Prescription uploaded", done: Boolean(prescriptionFile) },
                      { label: "Prescription confirmed", done: hasValidPrescription },
                    ].map((c) => (
                      <div key={c.label} className="flex items-center gap-3">
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${c.done ? "bg-emerald-100" : "bg-[#f0ece6]"}`}>
                          {c.done ? (
                            <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-[#c8d0d8]" />
                          )}
                        </div>
                        <span className={`text-xs ${c.done ? "font-semibold text-slate-700" : "text-slate-400"}`}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f0ece6]">
                    <div
                      className="progress-line h-full rounded-full transition-all duration-500"
                      style={{ width: `${([hasContactDetails, hasPatientDetails, cartItems.length > 0, Boolean(prescriptionFile), hasValidPrescription].filter(Boolean).length / 5) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs text-slate-400">
                    {[hasContactDetails, hasPatientDetails, cartItems.length > 0, Boolean(prescriptionFile), hasValidPrescription].filter(Boolean).length} of 5 complete
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function InputField({
  autoCapitalize,
  inputMode,
  label,
  min,
  name,
  onChange,
  pattern,
  placeholder = "",
  required = false,
  title,
  type = "text",
  value,
}) {
  return (
    <label className="block">
      <span className={LABEL_STYLE}>{label}{required && <span className="ml-1 text-[#c8701a]">*</span>}</span>
      <input
        autoCapitalize={autoCapitalize}
        className={FIELD_STYLE}
        inputMode={inputMode}
        min={min}
        name={name}
        onChange={onChange}
        pattern={pattern}
        placeholder={placeholder}
        required={required}
        title={title}
        type={type}
        value={value}
      />
    </label>
  );
}

function SelectField({ children, label, name, onChange, required = false, value }) {
  return (
    <label className="block">
      <span className={LABEL_STYLE}>{label}{required && <span className="ml-1 text-[#c8701a]">*</span>}</span>
      <select
        className={FIELD_STYLE}
        name={name}
        onChange={onChange}
        required={required}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function TextAreaField({ label, name, onChange, placeholder = "", required = false, value }) {
  return (
    <label className="block">
      <span className={LABEL_STYLE}>{label}{required && <span className="ml-1 text-[#c8701a]">*</span>}</span>
      <textarea
        className={`${FIELD_STYLE} min-h-24 resize-y`}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        value={value}
      />
    </label>
  );
}
