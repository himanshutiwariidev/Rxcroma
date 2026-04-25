"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";

export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setLoginData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify(loginData),
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
      setMessage("Login successful. Redirecting to the homepage...");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (requestError) {
      setError(requestError.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7f0_0%,#ffffff_28%,#fff9f4_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#e8841a]">Login</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Sign in to your LifeRx account
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Use the email and password from your verified account to access your pharmacy
              profile.
            </p>
            <div className="mt-8 rounded-[2rem] border border-orange-100 bg-white/80 p-6 shadow-[0_20px_50px_-35px_rgba(232,132,26,0.28)]">
              <p className="text-lg font-semibold text-slate-950">Need a new account?</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Create an account first and complete OTP verification through email before logging
                in.
              </p>
              <Link
                href="/signup"
                className="mt-5 inline-flex rounded-full bg-[#e8841a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf6f0b]"
              >
                Go to signup
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_24px_64px_-40px_rgba(232,132,26,0.28)]">
            <form className="space-y-5" onSubmit={handleLogin}>
              <AuthField
                label="Email address"
                name="email"
                onChange={handleFieldChange}
                required
                type="email"
                value={loginData.email}
              />
              <AuthField
                label="Password"
                name="password"
                onChange={handleFieldChange}
                required
                type="password"
                value={loginData.password}
              />

              <StatusMessage error={error} message={message} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-full bg-[#e8841a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf6f0b] disabled:cursor-not-allowed disabled:bg-orange-200"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-[#e8841a] hover:text-[#cf6f0b]">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function AuthField({ label, name, onChange, required = false, type = "text", value }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#e8841a]"
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
