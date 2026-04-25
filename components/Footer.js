import Link from "next/link";

const footerColumns = {
  Information: [
    { label: "How to Order", href: "/#how-to-order" },
    { label: "About Us", href: "/#about" },
    { label: "Contact Us", href: "/#contact" },
    { label: "FAQs", href: "/#faq" },
  ],
  Account: [
    { label: "Checkout", href: "/checkout" },
    { label: "Login / Signup", href: "/login" },
    { label: "Create Account", href: "/signup" },
  ],
  Policies: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Compliance Disclosures", href: "/compliance" },
  ],
};

const socialLinks = ["Facebook", "LinkedIn", "Twitter", "Instagram"];

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#f2aa57]">Contact Us</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Pharmacy support and compliance contact details
          </h2>
          <div className="mt-8 space-y-3 text-base leading-8 text-slate-300">
            <p>Unit 208, 4656 Westwinds Drive, NE, Calgary, AB Canada T3J 3Z5</p>
            <p>support@Rxcroma.com</p>
            <p>1-279-999-8688 (Local US)</p>
            <p>1-412-365-5972 (Local US Fax)</p>
            <p>1-888-704-0408</p>
            <p>1-800-871-7907</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <a
                key={social}
                href="#social"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#f2aa57] hover:text-[#f2aa57]"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {Object.entries(footerColumns).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-400">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition hover:text-[#f2aa57]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm leading-7 text-slate-400">
          <p>
            Prescription medication requests are processed only upon receipt of a valid prescription.
            Country/region of dispensing is disclosed prior to order placement. Personal and financial
            information is handled according to our published privacy policy.
          </p>
        </div>
      </div>
    </footer>
  );
}
