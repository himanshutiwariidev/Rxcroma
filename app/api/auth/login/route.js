import { NextResponse } from "next/server";
import { loginUser } from "../../../../lib/authStore";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = loginUser({ email, password });

    return NextResponse.json({
      message: "Logged in successfully.",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to log in right now." },
      { status: 401 },
    );
  }
}
