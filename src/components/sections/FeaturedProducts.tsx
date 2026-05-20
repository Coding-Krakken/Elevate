import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

export function FeaturedProducts({
  selectedCategory,
  products,
}: {
  selectedCategory: string | null;
  products: Product[];
}) {
  const filtered = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <section>
      <h2 className="mb-2.5 text-sm font-black tracking-[0.16em] text-white">FEATURED PRODUCTS</h2>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-slate-300">
          No products in this category yet. Try another category.
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
