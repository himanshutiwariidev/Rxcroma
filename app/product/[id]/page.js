import Link from "next/link";
import Footer from "../../../components/Footer";
import FeaturedProductsGrid from "../../../components/FeaturedProductsGrid";
import Navbar from "../../../components/Navbar";
import ProductDetailView from "../../../components/ProductDetailView";
import TopBar from "../../../components/TopBar";
import products from "../../../data/products.json";

function slugifyCategory(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = products.find((item) => String(item.id) === id);

  const relatedProducts = product
    ? products
        .filter(
          (item) =>
            item.id !== product.id &&
            (item.subCategory
              ? item.subCategory === product.subCategory
              : item.category === product.category),
        )
        .slice(0, 4)
    : [];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff8ff_0%,#f8fbff_12%,#ffffff_45%,#f5fbff_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
        {product ? (
          <>
            <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
              <Link href="/" className="hover:text-[#e8841a]">
                Home
              </Link>
              <span>/</span>
              <Link
                href={`/category/${slugifyCategory(product.category)}`}
                className="hover:text-[#e8841a]"
              >
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-slate-800">{product.name}</span>
            </nav>

            <div className="mt-8">
              <ProductDetailView product={product} />
            </div>

            {relatedProducts.length > 0 ? (
              <div className="mt-20">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Related products
                </h2>
                <FeaturedProductsGrid products={relatedProducts} />
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-orange-200 bg-[#fff8f1] p-8">
            <p className="text-base text-slate-700">
              We could not find that product. Please return to the homepage and browse our
              categories.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-full bg-[#e8841a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#cf6f0b]"
            >
              Back to Home
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
