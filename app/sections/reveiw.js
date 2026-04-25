"use client";

import { useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdVerified } from "react-icons/md";

const reviewsData = [
    {
        id: 1,
        name: "Oliver Thompson",
        city: "🇦🇺 Australia",
        rating: 5,
        text: "Fast delivery and genuine medicines. Packaging was safe and support team responded quickly.",
        verified: true,
        source: "google",
    },
    {
        id: 2,
        name: "Pooja Singh",
        city: "Patna",
        rating: 5,
        text: "Great experience! I received my order on time and the prices are better than local stores.",
        verified: true,
        source: "google",
    },
    {
        id: 3,
        name: "James Walker",
        city: "🇬🇧 UK",
        rating: 4,
        text: "Good service. Order tracking updates were accurate and medicines were sealed properly.",
        verified: true,
        source: "google",
    },
    {
        id: 4,
        name: "Neha Gupta",
        city: "Bangalore",
        rating: 5,
        text: "Very smooth ordering process. Delivery was quick and product quality is top-notch.",
        verified: true,
        source: "google",
    },
    {
        id: 5,
        name: "Michael Carter",
        city: "🇺🇸 USA",
        rating: 4,
        text: "Trusted platform. Customer support helped me with prescription upload in minutes.",
        verified: true,
        source: "google",
    },
    {
        id: 6,
        name: "Anjali Roy",
        city: "Mumbai",
        rating: 5,
        text: "Best pharmacy site I’ve used. Easy checkout and good discounts on medicines.",
        verified: true,
        source: "google",
    },
];

function Star({ filled }) {
    return (
        <svg
            viewBox="0 0 20 20"
            className={`h-4 w-4 ${filled ? "text-yellow-400" : "text-slate-300"}`}
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M10 15.27l-5.18 2.73 1-5.81L1.64 7.5l5.82-.84L10 1.5l2.54 5.16 5.82.84-4.18 4.69 1 5.81z" />
        </svg>
    );
}

function RatingStars({ value }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} filled={i <= value} />
            ))}
        </div>
    );
}

export default function ReviewsSection() {
    const [activeRating, setActiveRating] = useState("all");

    const filteredReviews = useMemo(() => {
        if (activeRating === "all") return reviewsData;
        return reviewsData.filter((r) => r.rating === Number(activeRating));
    }, [activeRating]);

    const stats = useMemo(() => {
        const total = reviewsData.length;
        const avg =
            reviewsData.reduce((acc, cur) => acc + cur.rating, 0) / total || 0;

        const counts = [1, 2, 3, 4, 5].reduce((acc, n) => {
            acc[n] = reviewsData.filter((r) => r.rating === n).length;
            return acc;
        }, {});

        return { total, avg, counts };
    }, []);

    return (
        <section className="w-full bg-gradient-to-b from-white to-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                            ⭐ Trusted by customers
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Customer Reviews
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                            Real feedback from customers who order medicines and healthcare
                            products from <span className="font-semibold">Medishipper</span>.
                        </p>
                    </div>

                    {/* Rating Summary */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl font-extrabold text-slate-900">
                                {stats.avg.toFixed(1)}
                            </div>
                            <div className="flex flex-col">
                                <RatingStars value={Math.round(stats.avg)} />
                                <p className="text-xs text-slate-500">
                                    Based on {stats.total} reviews
                                </p>
                            </div>
                        </div>

                        {/* Distribution */}
                        <div className="mt-4 space-y-2">
                            {[5, 4, 3, 2, 1].map((n) => {
                                const count = stats.counts[n] || 0;
                                const percent =
                                    stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);

                                return (
                                    <div key={n} className="flex items-center gap-2 text-xs">
                                        <span className="w-6 font-medium text-slate-700">{n}</span>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-emerald-500"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className="w-10 text-right text-slate-500">
                                            {percent}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="mt-10 flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setActiveRating("all")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeRating === "all"
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        All Reviews
                    </button>

                    {[5, 4, 3, 2, 1].map((r) => (
                        <button
                            key={r}
                            onClick={() => setActiveRating(String(r))}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${activeRating === String(r)
                                    ? "bg-sky-500 text-white"
                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            <span>{r}</span>
                            <span className="text-xs text-yellow-500 opacity-90">★</span>
                        </button>
                    ))}
                </div>

                {/* Reviews Grid */}
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                        >
                            {/* Glow */}
                            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 blur-2xl opacity-0 transition group-hover:opacity-100" />

                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-slate-900">
                                        {review.name}
                                    </h3>
                                    <span className="text-sky-500"><MdVerified /></span>

                                </div>

                              
                                <div className="flex items-center gap-2">
                                    {/* Google Icon Badge */}
                                    {review.source === "google" && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                                            <FcGoogle className="text-base" />

                                        </span>
                                    )}

                                    
                                </div>
                            </div>
                              <div>
                                    <p className="text-xs text-slate-500">{review.city}</p>
                                </div>
                            <div className="mt-3">
                                <RatingStars value={review.rating} />
                            </div>

                            <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                “{review.text}”
                            </p>

                            <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                               {review.verified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            ✓ Verified customer
                                        </span>
                                    )}

                            </div>
                        </div>
                    ))}
                </div>

                
            </div>
        </section>
    );
}
