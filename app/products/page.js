import FeaturedProductsGrid from "../../components/FeaturedProductsGrid";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";
import products from "../../data/products.json";

export default function AllProductsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff8ff_0%,#f8fbff_12%,#ffffff_45%,#f5fbff_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e8841a] sm:text-sm sm:tracking-[0.28em]">
          All Products
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:mt-4 sm:text-5xl">
          Browse all prescription products
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">
          Showing all {products.length} products across every category.
        </p>

        <FeaturedProductsGrid products={products} />
      </section>

      <Footer />
    </main>
  );
}
