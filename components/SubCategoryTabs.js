"use client";

import { useState } from "react";
import FeaturedProductsGrid from "./FeaturedProductsGrid";

export default function SubCategoryTabs({ subCategoryGroups }) {
  const subCategoryNames = Object.keys(subCategoryGroups);
  const [activeTab, setActiveTab] = useState("All");

  const totalCount = subCategoryNames.reduce(
    (sum, name) => sum + subCategoryGroups[name].length,
    0,
  );

  const tabs = [
    { name: "All", count: totalCount },
    ...subCategoryNames.map((name) => ({ name, count: subCategoryGroups[name].length })),
  ];

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-6 border-b border-orange-100 bg-white/90 px-6 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4 sm:shadow-[0_18px_45px_-36px_rgba(232,132,26,0.28)]">
        <div className="flex snap-x gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              className={`flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.name
                  ? "bg-[#e8841a] text-white shadow-[0_10px_24px_-10px_rgba(232,132,26,0.7)]"
                  : "border border-orange-200 text-slate-700 hover:border-[#e8841a] hover:text-[#e8841a]"
              }`}
            >
              {tab.name}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.name ? "bg-white/25 text-white" : "bg-orange-50 text-[#e8841a]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "All" ? (
        subCategoryNames.map((name) => (
          <div key={name} className="mt-12 scroll-mt-24 sm:mt-14">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {name}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-sm">
                {subCategoryGroups[name].length} products
              </span>
            </div>
            <FeaturedProductsGrid products={subCategoryGroups[name]} />
          </div>
        ))
      ) : (
        <div className="mt-8 sm:mt-10">
          <FeaturedProductsGrid products={subCategoryGroups[activeTab]} />
        </div>
      )}
    </div>
  );
}
