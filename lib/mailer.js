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

export async function sendOtpEmail({ email, fullName, otp }) {
  const transportConfig = getTransportConfig();

  if (!transportConfig) {
    const transporter = nodemailer.createTransport({
      jsonTransport: true,
    });

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

  const transporter = nodemailer.createTransport(transportConfig);

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
