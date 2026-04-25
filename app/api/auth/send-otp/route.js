import { NextResponse } from "next/server";
import { queueSignup } from "../../../../lib/authStore";
import { sendOtpEmail } from "../../../../lib/mailer";

export async function POST(request) {
  try {
    const { email, fullName, password } = await request.json();

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "Full name, email, and password are required." },
        { status: 400 },
      );
    }

    if (password.trim().length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    const pendingSignup = queueSignup({
      email,
      fullName,
      password,
    });

    const mailResult = await sendOtpEmail({
      email: pendingSignup.email,
      fullName: pendingSignup.fullName,
      otp: pendingSignup.otp,
    });

    return NextResponse.json({
      message: mailResult.sent
        ? "OTP sent to your email address."
        : "SMTP is not configured yet. Development preview OTP generated.",
      previewOtp: mailResult.previewOtp ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to send OTP right now." },
      { status: 400 },
    );
  }
}
