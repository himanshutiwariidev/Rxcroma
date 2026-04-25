"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";

const initialSignupData = {
  email: "",
  fullName: "",
  password: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [signupData, setSignupData] = useState(initialSignupData);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup");
  const [message, setMessage] = useState("");
  const [previewOtp, setPreviewOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setSignupData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        body: JSON.stringify(signupData),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
      setPreviewOtp(data.previewOtp || "");
      setStep("otp");
    } catch (requestError) {
      setError(requestError.message || "Unable to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        body: JSON.stringify({
          email: signupData.email,
          otp,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      window.localStorage.setItem("liferx-user", JSON.stringify(data.user));
      setMessage("Account created successfully. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (requestError) {
      setError(requestError.message || "Unable to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7f0_0%,#ffffff_28%,#fff9f4_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#e8841a]">
              Create Account
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Sign up with email OTP verification
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Enter your details, receive a one-time code on email, and verify your account before
              signing in.
            </p>
            <div className="mt-8 rounded-[2rem] border border-orange-100 bg-white/80 p-6 shadow-[0_20px_50px_-35px_rgba(232,132,26,0.28)]">
              <p className="text-lg font-semibold text-slate-950">How this works</p>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>1. Fill in your name, email, and password.</li>
                <li>2. We send a six-digit OTP through Nodemailer.</li>
                <li>3. Enter the OTP to finish creating your account.</li>
              </ol>
            </div>
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_24px_64px_-40px_rgba(232,132,26,0.28)]">
            {step === "signup" ? (
              <form className="space-y-5" onSubmit={handleSendOtp}>
                <AuthField
                  label="Full name"
                  name="fullName"
                  onChange={handleFieldChange}
                  required
                  value={signupData.fullName}
                />
                <AuthField
                  label="Email address"
                  name="email"
                  onChange={handleFieldChange}
                  required
                  type="email"
                  value={signupData.email}
                />
                <AuthField
                  label="Password"
                  minLength={6}
                  name="password"
                  onChange={handleFieldChange}
                  required
                  type="password"
                  value={signupData.password}
                />

                <StatusMessage error={error} message={message} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-full bg-[#e8841a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf6f0b] disabled:cursor-not-allowed disabled:bg-orange-200"
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleVerifyOtp}>
                <div className="rounded-[1.5rem] bg-[#fff8f1] p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    OTP sent to <span className="text-[#cf6f0b]">{signupData.email}</span>
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{message}</p>
                  {previewOtp ? (
                    <p className="mt-3 text-sm font-semibold text-[#cf6f0b]">
                      Dev preview OTP: {previewOtp}
                    </p>
                  ) : null}
                </div>

                <AuthField
                  label="Enter OTP"
                  name="otp"
                  onChange={(event) => setOtp(event.target.value)}
                  required
                  value={otp}
                />

                <StatusMessage error={error} message={message && !previewOtp ? message : ""} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-full bg-[#e8841a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf6f0b] disabled:cursor-not-allowed disabled:bg-orange-200"
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("signup");
                    setOtp("");
                    setError("");
                    setMessage("");
                  }}
                  className="inline-flex w-full justify-center rounded-full border border-orange-200 px-5 py-3 text-sm font-semibold text-[#cf6f0b] transition hover:bg-[#fff8f1]"
                >
                  Edit signup details
                </button>
              </form>
            )}

            <p className="mt-6 text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#e8841a] hover:text-[#cf6f0b]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function AuthField({
  label,
  minLength,
  name,
  onChange,
  required = false,
  type = "text",
  value,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#e8841a]"
        minLength={minLength}
        name={name}
        onChange={onChange}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

function StatusMessage({ error, message }) {
  if (!error && !message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm ${
        error
          ? "border border-red-200 bg-red-50 text-red-700"
          : "border border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {error || message}
    </div>
  );
}
