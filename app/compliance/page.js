import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";

export const metadata = {
  title: "Compliance Disclosures | LifeRx Pharmacy",
  description: "Website transparency and prescription compliance disclosures.",
};

const disclosures = [
  {
    title: "Prescription Requirement",
    body: "Prescription medications are processed only upon receipt of a valid prescription from a licensed prescriber.",
  },
  {
    title: "Dispensing Country Transparency",
    body: "Potential dispensing countries/regions are disclosed in customer-facing content and again before order placement and charging.",
  },
  {
    title: "Contact Transparency",
    body: "Phone number and mailing address are prominently published to allow direct customer support access.",
  },
  {
    title: "Pharmacist Consultation",
    body: "Customers with placed orders may request consultation with a licensed pharmacist through published support channels.",
  },
  {
    title: "Privacy and Security",
    body: "Personal and financial information is handled in accordance with the published privacy policy and encrypted data transmission practices.",
  },
  {
    title: "Marketing Claims",
    body: "Product and quality messaging is reviewed to avoid false, misleading, or unsubstantiated claims.",
  },
];

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf3_0%,#ffffff_42%,#f6fbff_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#e8841a]">Compliance</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Website disclosures aligned with verification standards
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
          This page summarizes core website-facing requirements referenced in the International
          Pharmacy Verification Program Accreditation Standards & Guide (latest revision listed in the
          document as February 25, 2026).
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {disclosures.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-orange-100 bg-white p-7 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.35)]"
            >
              <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-8 text-slate-700">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-cyan-100 bg-[#f3fbff] p-7 text-sm leading-8 text-slate-700">
          Note: This page is a high-level disclosure summary for patient visibility. Full legal,
          licensing, and operational compliance obligations are governed by applicable law, internal
          SOPs, and accreditation requirements.
        </div>
      </section>

      <Footer />
    </main>
  );
}
