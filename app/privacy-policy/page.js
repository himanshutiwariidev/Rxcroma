import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";

export const metadata = {
  title: "Privacy Policy | LifeRx Pharmacy",
  description: "Privacy and confidentiality policy for personal and financial information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fcff_0%,#ffffff_45%,#f5f9ff_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#e8841a]">Privacy Policy</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Privacy and confidentiality commitments
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
          Effective date: April 19, 2026. This policy summarizes how customer data is handled for
          prescription order requests and support services.
        </p>

        <div className="mt-10 space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)]">
          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Information we collect</h2>
            <p className="mt-3 text-sm leading-8 text-slate-700">
              We collect personal, contact, prescription-order, and payment-related information that is
              necessary to process requests, provide customer support, and satisfy legal and regulatory
              obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">How information is used</h2>
            <p className="mt-3 text-sm leading-8 text-slate-700">
              Personal or financial information is used only to process and dispense prescription orders,
              provide pharmacist/customer support, maintain service quality, and meet applicable legal,
              regulatory, and accreditation program requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Sharing limitations</h2>
            <p className="mt-3 text-sm leading-8 text-slate-700">
              Customer personal or financial information is not shared with third parties except where
              required to process and dispense orders, comply with PharmacyChecker program standards,
              or fulfill government/legal requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Security controls</h2>
            <p className="mt-3 text-sm leading-8 text-slate-700">
              Pages that transmit personal or financial data are protected by secure encrypted transport
              technology (SSL/TLS or equivalent), and operational safeguards are applied to protect data
              confidentiality and integrity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Contact for privacy questions</h2>
            <p className="mt-3 text-sm leading-8 text-slate-700">
              Email: support@liferxpharmacy.com
              <br />
              Phone: 1-279-999-8688
              <br />
              Mailing address: Unit 208, 4656 Westwinds Drive, NE, Calgary, AB Canada T3J 3Z5
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
