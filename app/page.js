import Image from "next/image";
import Link from "next/link";
import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiGlobe,
  FiHeadphones,
  FiMessageCircle,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import Footer from "../components/Footer";
import FeaturedProductsGrid from "../components/FeaturedProductsGrid";
import Navbar from "../components/Navbar";
import TopBar from "../components/TopBar";
import featuredProducts from "../data/products.json";
import ReviewsSection from "./sections/reveiw";
import WhyChooseUs from "./sections/whychooseus";
import Howtoorder from "./sections/howtoorder";

const categoryImageMap = {
  "Diabetes": "/images/diabetes.png",
  "Antibiotics": "/images/antibiotics.png",
  "Cardiac / Blood Pressure": "/images/heart.png",
  "Erectile Dysfunction": "/images/ed.png",
  "Mental Health / CNS": "/images/mentalhealth.png",
  "Gastro / Acid Reflux": "/images/gastro.png",
  "Respiratory / Asthma": "/images/respiratory.png",
  "Thyroid / Hormonal": "/images/thyroid.png",
  "Pain / Anti-inflammatory": "/images/pain.png",
};

const categories = Object.values(
  featuredProducts.reduce((acc, product) => {
    const key = product.category || "General";
    if (!acc[key]) {
      acc[key] = {
        title: key,
        image: categoryImageMap[key],
        count: 0,
        samples: [],
      };
    }

    acc[key].count += 1;
    if (acc[key].samples.length < 3) {
      acc[key].samples.push(product.brandName || product.name);
    }
    return acc;
  }, {})
);

function slugifyCategory(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const footerHighlights = [
  {
    title: "Fast Shipping",
    description: "Fast Shipping - Fast Delivery to Your Home",
    icon: FiPackage,
  },
  {
    title: "Money Guarantee",
    description: "Guaranteed Low Prices - Quality Assured",
    icon: FiShield,
  },
  {
    title: "Payment Method",
    description: "Secure System",
    icon: FiCreditCard,
  },
  {
    title: "Online Support",
    description: "24 hours on day",
    icon: FiHeadphones,
  },
];

const highlights = [
  {
    title: "Verification Program Standards",
    description: "Operations aligned with published accreditation standards and disclosures.",
    icon: "thumb",
  },
  {
    title: "Valid Prescription Required",
    description: "Prescription products are processed only after a valid prescription is received.",
    icon: "shipping",
  },
  {
    title: "Country Transparency",
    description: "Dispensing country/region is disclosed before order placement and charging.",
    icon: "delivery",
  },
  {
    title: "Secure Information Handling",
    description: "Checkout and account data are handled through encrypted transmission controls.",
    icon: "shield",
  },
];

const trustBadges = [
  {
    title: "Genuine Medicines",
    icon: FiCheckCircle,
  },
  {
    title: "Global Shipping",
    icon: FiGlobe,
  },
  {
    title: "On Time Delivery",
    icon: FiClock,
  },
  {
    title: "Pharmacist Consultation",
    icon: FiMessageCircle,
  },
];

const dispensingCountries = ["Canada", "United Kingdom", "us", "India (selected products)"];

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#e8841a]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
    </div>
  );
}

function HighlightIcon({ type }) {
  const iconClass = "h-12 w-12 text-[#f28c1b]";

  if (type === "thumb") {
    return (
      <svg viewBox="0 0 64 64" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M26 28V16c0-6 4-10 7-14l3 2c2 2 2 5 1 7l-3 11h15c4 0 7 3 7 7 0 1 0 2-.4 3l-4 16c-.9 3.5-4 6-7.7 6H26c-2.2 0-4-1.8-4-4V32c0-2.2 1.8-4 4-4Zm-14 2h6v24h-6c-2.2 0-4-1.8-4-4V34c0-2.2 1.8-4 4-4Z" />
      </svg>
    );
  }

  if (type === "shipping") {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden="true">
        <rect x="7" y="18" width="24" height="20" rx="4" fill="currentColor" />
        <path d="M31 24h11l8 8v6H31V24Z" fill="currentColor" />
        <circle cx="20" cy="45" r="5" fill="currentColor" />
        <circle cx="43" cy="45" r="5" fill="currentColor" />
        <path d="M10 14h17M10 9h22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M13 25h12M13 31h9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "delivery") {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden="true">
        <circle cx="21" cy="18" r="11" stroke="currentColor" strokeWidth="4" />
        <path d="M21 12v7h5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="28" width="24" height="12" rx="3" fill="currentColor" />
        <path d="M38 30h8l6 7v3H38v-10Z" fill="currentColor" />
        <circle cx="24" cy="47" r="5" fill="currentColor" />
        <circle cx="46" cy="47" r="5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden="true">
      <path d="M32 8 48 14c3 1 5 4 5 8v10c0 12-8.7 20.3-19.1 23.7a6 6 0 0 1-3.8 0C19.7 52.3 11 44 11 32V22c0-4 2-7 5-8L32 8Z" fill="currentColor" />
      <circle cx="32" cy="30" r="10" fill="#fff" />
      <path d="m27.5 30.5 3 3 6-7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="bg-[linear-gradient(180deg,#eff8ff_0%,#f8fbff_12%,#ffffff_45%,#f5fbff_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="relative h-[600px] overflow-hidden">
        <Image
          src="/images/banner.webp"
          alt="Hero background"
          fill
          className="hidden object-cover object-center md:block"
          priority
        />
        <Image
          src="/images/mobilebanner.webp"
          alt="Hero background"
          fill
          className="object-contain object-center md:hidden"
          priority
        />
      </section>

      <section className="bg-[#083b4f] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd59f]">
            Prescription products require a valid prescription before processing.
          </p>
          <div className="text-sm leading-7 text-cyan-100">
            Pharmacist consultation available for placed orders. Response target: within 72 hours.
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;

              return (
                <article
                  key={badge.title}
                  className="flex min-h-32 items-center gap-5 rounded-[1.75rem] border border-orange-100 bg-[#fffaf5] p-6 shadow-[0_18px_45px_-36px_rgba(232,132,26,0.28)]"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-[#e8841a] shadow-[0_14px_30px_-24px_rgba(232,132,26,0.7)]">
                    <Icon className="h-9 w-9 stroke-[1.8]" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold leading-6 text-slate-950">
                    {badge.title}
                  </h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="rx-products" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#e8841a]">
              Shop By Category
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Browse popular prescription categories
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              Explore commonly requested treatment areas with a quick category grid right below the
              hero banner.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => {
            return (
              <Link
                key={category.title}
                href={`/category/${slugifyCategory(category.title)}`}
                className="overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white p-4 text-left shadow-[0_18px_45px_-34px_rgba(232,132,26,0.28)] transition hover:-translate-y-1 hover:border-[#e8841a] hover:shadow-[0_28px_60px_-34px_rgba(232,132,26,0.34)]"
              >
                <div className="relative md:h-45 h-30 w-full">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold leading-6 text-slate-900">
                  {category.title}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#e8841a]">
                  {category.count} products
                </p>
               
              </Link>
            );
          })}
        </div>
      </section>
<Howtoorder/>
 <section id="featured" className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          eyebrow="Featured Products"
          title="Popular prescription products"
          description="Product order requests are accepted only after prescription and policy checks are completed."
        />
        <FeaturedProductsGrid products={featuredProducts} />
      </section>
            <WhyChooseUs />

      <section className="bg-[#f4f6ff]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              <span className="text-[#f28c1b]">LifeRx Pharmacy</span>{" "}
              <span className="text-[#095b73]">Online Advantage</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-600 md:text-[1rem] sm:leading-[1.35]">
              Get the advantage of choosing LifeRx Pharmacy as your trusted online prescription
              service provider.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-[#dfe5f0] bg-white px-8 py-9 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
              >
                <div className="flex justify-center">
                  <HighlightIcon type={item.icon} />
                </div>
                <h3 className="mt-5 text-[1rem] font-semibold leading-tight text-[#1f1f1f]">
                  {item.title}
                </h3>
                <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
     

     

  <section
  id="about"
  className="relative overflow-hidden bg-[linear-gradient(135deg,#f0fdf4_0%,#ecfeff_52%,#ffffff_100%)]"
>
  {/* Background Blur Effects */}
  <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"></div>
  <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl"></div>

  <div className="relative mx-auto max-w-7xl px-6 py-24">
    <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      
      {/* Left Content */}
      <div>
        <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold tracking-wide text-emerald-700">
          About Us
        </span>

        <h2 className="mt-5 text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
          Patient Safety &
          <span className="block text-[#e8841a]">
            Transparent Healthcare
          </span>
        </h2>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          We are committed to responsible pharmacy practices with complete
          transparency, prescription compliance, and secure customer support at
          every stage of your healthcare journey.
        </p>

        <div className="mt-10 space-y-6">
          {[
            "Prescription medicines are processed only against valid prescriptions from licensed healthcare professionals.",
            "Dispensing country and important order details are clearly shown before checkout for informed decisions.",
            "Customer data and payments are protected using secure encrypted systems and privacy-first processes.",
          ].map((text, index) => (
            <div key={index} className="flex gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                ✓
              </div>
              <p className="text-base leading-7 text-slate-700">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          "Valid prescription required",
          "Dispensing country visible",
          "Verified contact details",
          "Pharmacist consultation support",
          "Privacy policy protection",
          "Accurate healthcare claims",
        ].map((item) => (
          <div
            key={item}
            className="group rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_-30px_rgba(232,132,26,0.28)]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8841a] to-orange-500 text-xl font-bold text-white shadow-lg">
              ✓
            </div>

            <p className="mt-5 text-lg font-semibold leading-7 text-slate-900">
              {item}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Trusted systems and transparent processes designed for customer
              confidence.
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <section id="faq" className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Required pharmacy disclosures"
          description="Key points shown here summarize website-facing standards from accreditation guidance."
          centered
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_-46px_rgba(15,23,42,0.35)]">
            <h3 className="text-xl font-semibold text-slate-950">Where can medications be dispensed from?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Potential dispensing countries/regions for this site include {dispensingCountries.join(", ")}.
              Final dispensing location is shown before order placement.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_-46px_rgba(15,23,42,0.35)]">
            <h3 className="text-xl font-semibold text-slate-950">Do I need a prescription?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Yes. Prescription medications are processed only after receipt and verification of a valid
              prescription.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_-46px_rgba(15,23,42,0.35)]">
            <h3 className="text-xl font-semibold text-slate-950">How can I contact a pharmacist?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Customers with placed orders can request consultation with a licensed pharmacist through
              phone or email support channels.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_-46px_rgba(15,23,42,0.35)]">
            <h3 className="text-xl font-semibold text-slate-950">Which policies should I review?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Please review our Privacy Policy and Compliance page before checkout.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/privacy-policy"
                className="inline-flex rounded-full bg-[#e8841a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cf6f0b]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/compliance"
                className="inline-flex rounded-full border border-[#e8841a] px-4 py-2 text-sm font-semibold text-[#e8841a] transition hover:bg-[#fff7ee]"
              >
                Compliance Disclosures
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="border-t border-white/6 bg-[#2d303a] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2 xl:grid-cols-4">
          {footerHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center text-[#4f7fff]">
                  <Icon className="h-12 w-12 stroke-[1.7]" />
                </div>
                <div>
                  <h3 className="text-[1.3rem] font-semibold leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-8 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
