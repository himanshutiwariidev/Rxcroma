import Link from "next/link";
import FeaturedProductsGrid from "../../components/FeaturedProductsGrid";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";
import products from "../../data/products.json";

function normalize(value) {
  return String(value || "").toLowerCase();
}

function productMatchesQuery(product, query) {
  const normalizedQuery = normalize(query).trim();

  if (!normalizedQuery) {
    return false;
  }

  return [product.drugName, product.brandName, product.name].some((value) =>
    normalize(value).includes(normalizedQuery),
  );
}

function sortByBestMatch(query) {
  const normalizedQuery = normalize(query).trim();

  return (firstProduct, secondProduct) => {
    const firstStartsWithQuery = [firstProduct.drugName, firstProduct.brandName, firstProduct.name].some(
      (value) => normalize(value).startsWith(normalizedQuery),
    );
    const secondStartsWithQuery = [secondProduct.drugName, secondProduct.brandName, secondProduct.name].some(
      (value) => normalize(value).startsWith(normalizedQuery),
    );

    if (firstStartsWithQuery === secondStartsWithQuery) {
      return firstProduct.name.localeCompare(secondProduct.name);
    }

    return firstStartsWithQuery ? -1 : 1;
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q.trim() : "";
  const results = query
    ? products.filter((product) => productMatchesQuery(product, query)).sort(sortByBestMatch(query))
    : [];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff8ff_0%,#f8fbff_12%,#ffffff_45%,#f5fbff_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#e8841a]">
          Product Search
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {query ? `Search results for "${query}"` : "Search products"}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          Matching prescription listings from the current catalog.
        </p>

        <div className="mt-6">
          <Link
            href="/#rx-products"
            className="inline-flex rounded-full border border-[#e8841a] px-5 py-2.5 text-sm font-semibold text-[#e8841a] transition hover:bg-[#fff7ee]"
          >
            Browse categories
          </Link>
        </div>

        {query && results.length > 0 && <FeaturedProductsGrid products={results} />}

        {query && results.length === 0 && (
          <div className="mt-10 rounded-[1.5rem] border border-dashed border-orange-200 bg-[#fff8f1] p-8">
            <p className="text-base font-semibold text-slate-800">
              No products found for "{query}".
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Try another drug name or brand name.
            </p>
          </div>
        )}

        {!query && (
          <div className="mt-10 rounded-[1.5rem] border border-dashed border-orange-200 bg-[#fff8f1] p-8">
            <p className="text-base text-slate-700">
              No search query entered.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
