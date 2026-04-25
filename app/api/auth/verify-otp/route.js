import { NextResponse } from "next/server";
import { confirmSignup } from "../../../../lib/authStore";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email?.trim() || !otp?.trim()) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 },
      );
    }

    const user = confirmSignup({ email, otp });

    return NextResponse.json({
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to verify OTP right now." },
      { status: 400 },
    );
  }
}
