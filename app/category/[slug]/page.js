import Link from "next/link";
import Footer from "../../../components/Footer";
import FeaturedProductsGrid from "../../../components/FeaturedProductsGrid";
import Navbar from "../../../components/Navbar";
import SubCategoryTabs from "../../../components/SubCategoryTabs";
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

export default async function CategoryProductsPage({ params }) {
  const { slug } = await params;

  const categories = [...new Set(products.map((product) => product.category))];
  const matchedCategory = categories.find((category) => slugifyCategory(category) === slug);

  const categoryProducts = matchedCategory
    ? products.filter((product) => product.category === matchedCategory)
    : [];

  const subCategoryGroups = categoryProducts.reduce((acc, product) => {
    const key = product.subCategory || matchedCategory;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {});

  const hasSubCategories = Object.keys(subCategoryGroups).length > 1;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff8ff_0%,#f8fbff_12%,#ffffff_45%,#f5fbff_100%)] text-slate-900">
      <TopBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e8841a] sm:text-sm sm:tracking-[0.28em]">
          Category Products
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:mt-4 sm:text-5xl">
          {matchedCategory || "Category not found"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">
          {matchedCategory
            ? `Showing all products related to ${matchedCategory}.`
            : "We could not find that category. Please browse all categories from the homepage."}
        </p>

        <div className="mt-5 sm:mt-6">
          <Link
            href="/#rx-products"
            className="inline-flex rounded-full border border-[#e8841a] px-5 py-2.5 text-sm font-semibold text-[#e8841a] transition hover:bg-[#fff7ee]"
          >
            Back to categories
          </Link>
        </div>

        {matchedCategory ? (
          hasSubCategories ? (
            <div className="mt-8 sm:mt-10">
              <SubCategoryTabs subCategoryGroups={subCategoryGroups} />
            </div>
          ) : (
            <FeaturedProductsGrid products={categoryProducts} />
          )
        ) : (
          <div className="mt-10 rounded-[1.5rem] border border-dashed border-orange-200 bg-[#fff8f1] p-8">
            <p className="text-base text-slate-700">
              No products found for this category. Return to homepage and select another category.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
