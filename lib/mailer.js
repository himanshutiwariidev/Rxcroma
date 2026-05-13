import nodemailer from "nodemailer";

function getTransportConfig() {
  const {
    MAIL_FROM,
    SMTP_HOST,
    SMTP_PASS,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    return null;
  }

  return {
    auth: {
      pass: SMTP_PASS,
      user: SMTP_USER,
    },
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
  };
}

function getMailerDefaults() {
  return {
    from: process.env.MAIL_FROM || "Rxcroma <dev-preview@rxcroma.local>",
    isConfigured: Boolean(getTransportConfig()),
  };
}

function createTransporter() {
  const transportConfig = getTransportConfig();

  if (!transportConfig) {
    return {
      isConfigured: false,
      transporter: nodemailer.createTransport({ jsonTransport: true }),
    };
  }

  return {
    isConfigured: true,
    transporter: nodemailer.createTransport(transportConfig),
  };
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(Number(value) || 0);
}

function renderItemsTable(items = []) {
  if (!items.length) {
    return "<p>No cart items were included.</p>";
  }

  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr>
          <th style="border-bottom:1px solid #e5e7eb;padding:8px;text-align:left;">Item</th>
          <th style="border-bottom:1px solid #e5e7eb;padding:8px;text-align:left;">Dosage</th>
          <th style="border-bottom:1px solid #e5e7eb;padding:8px;text-align:right;">Qty</th>
          <th style="border-bottom:1px solid #e5e7eb;padding:8px;text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td style="border-bottom:1px solid #f3f4f6;padding:8px;">${escapeHtml(item.name)}</td>
                <td style="border-bottom:1px solid #f3f4f6;padding:8px;">${escapeHtml(item.dosage || "-")}</td>
                <td style="border-bottom:1px solid #f3f4f6;padding:8px;text-align:right;">${escapeHtml(item.quantity)}</td>
                <td style="border-bottom:1px solid #f3f4f6;padding:8px;text-align:right;">${formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 0))}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderDetailRows(details = {}) {
  return Object.entries(details)
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <p style="margin:0 0 8px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>
      `,
    )
    .join("");
}

function formatCountry(country) {
  return {
    CA: "Canada",
    GB: "United Kingdom",
    US: "United States",
  }[country] || country;
}

export async function sendOtpEmail({ email, fullName, otp }) {
  const { isConfigured, transporter } = createTransporter();

  if (!isConfigured) {
    await transporter.sendMail({
      from: "dev-preview@liferx.local",
      html: `<p>Hello ${fullName}, your LifeRx verification code is <strong>${otp}</strong>.</p>`,
      subject: "LifeRx verification code",
      text: `Hello ${fullName}, your LifeRx verification code is ${otp}.`,
      to: email,
    });

    return {
      previewOtp: otp,
      sent: false,
    };
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    html: `
      <div style="font-family:Poppins,Arial,sans-serif;padding:24px;color:#1f2937;">
        <h2 style="margin:0 0 12px;color:#e8841a;">Verify your LifeRx account</h2>
        <p style="margin:0 0 14px;">Hello ${fullName},</p>
        <p style="margin:0 0 18px;">Use the OTP below to complete your account creation.</p>
        <div style="display:inline-block;padding:14px 20px;border-radius:14px;background:#fff4e8;color:#cf6f0b;font-size:28px;font-weight:700;letter-spacing:0.22em;">
          ${otp}
        </div>
        <p style="margin:18px 0 0;">This code expires in 10 minutes.</p>
      </div>
    `,
    subject: "LifeRx verification code",
    text: `Hello ${fullName}, your LifeRx verification code is ${otp}. It expires in 10 minutes.`,
    to: email,
  });

  return {
    sent: true,
  };
}

export async function sendCheckoutEmails({ attachment, customerDetails, items, orderTotal, prescriptionFileName }) {
  const { from, isConfigured } = getMailerDefaults();
  const { transporter } = createTransporter();
  const adminEmail = process.env.ORDER_ADMIN_EMAIL || process.env.SMTP_USER;

  if (!adminEmail) {
    throw new Error("ORDER_ADMIN_EMAIL or SMTP_USER must be configured to receive checkout orders.");
  }

  const customerName = customerDetails.fullName || "Customer";
  const customerEmail = customerDetails.email;
  const orderSummary = renderItemsTable(items);
  const contactRows = renderDetailRows({
    "Full name": customerDetails.fullName,
    Email: customerDetails.email,
    Country: customerDetails.countryName || formatCountry(customerDetails.country),
    Phone: customerDetails.phone,
    Address: [customerDetails.address, customerDetails.city, customerDetails.state, customerDetails.zipCode]
      .filter(Boolean)
      .join(", "),
  });
  const medicalRows = renderDetailRows({
    Age: customerDetails.age,
    "Body weight": customerDetails.bodyWeight,
    Height: customerDetails.height,
    Gender: customerDetails.gender,
    Diseases: customerDetails.diseases,
    Allergies: customerDetails.allergies,
    "Current medicines": customerDetails.currentMedicines,
    "Prescription history": customerDetails.prescriptionHistory,
    "Pregnancy / breastfeeding": customerDetails.pregnancyStatus,
    "Emergency contact": customerDetails.emergencyContact,
    Notes: customerDetails.notes,
  });

  await transporter.sendMail({
    attachments: attachment ? [attachment] : [],
    from,
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.55;">
        <h2 style="color:#c8701a;margin:0 0 12px;">New checkout order request</h2>
        <p style="margin:0 0 12px;"><strong>Total:</strong> ${formatCurrency(orderTotal)}</p>
        <p style="margin:0 0 16px;"><strong>Prescription file:</strong> ${escapeHtml(prescriptionFileName || "Attached")}</p>
        <h3 style="margin:18px 0 8px;">Items</h3>
        ${orderSummary}
        <h3 style="margin:18px 0 8px;">Contact details</h3>
        ${contactRows}
        <h3 style="margin:18px 0 8px;">Medical profile</h3>
        ${medicalRows}
      </div>
    `,
    replyTo: customerEmail,
    subject: `New Rxcroma order request from ${customerName}`,
    text: `New checkout order request from ${customerName}. Total: ${formatCurrency(orderTotal)}. Customer email: ${customerEmail}.`,
    to: adminEmail,
  });

  await transporter.sendMail({
    from,
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.55;">
        <h2 style="color:#c8701a;margin:0 0 12px;">We received your order request</h2>
        <p>Hello ${escapeHtml(customerName)},</p>
        <p>Your order request has been sent to our pharmacy team. A pharmacist will review your prescription and contact you before fulfillment.</p>
        <h3 style="margin:18px 0 8px;">Order summary</h3>
        ${orderSummary}
        <p style="margin:16px 0 0;"><strong>Total:</strong> ${formatCurrency(orderTotal)}</p>
      </div>
    `,
    subject: "Rxcroma order request received",
    text: `Hello ${customerName}, we received your order request. Total: ${formatCurrency(orderTotal)}. A pharmacist will review it and contact you before fulfillment.`,
    to: customerEmail,
  });

  return {
    sent: isConfigured,
  };
}
