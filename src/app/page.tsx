"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { FulfillmentBar } from "@/components/sections/FulfillmentBar";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { RewardsStrip } from "@/components/sections/RewardsStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products, offers, config } = useStorefrontContent();

  const activeProducts = products.filter((product) => product.isActive);
  const activeOffers = offers.filter((offer) => offer.isActive);

  return (
    <div className="mx-auto w-full max-w-[1540px] px-4 py-3 md:px-8 md:py-3">
      <Hero />
      <FulfillmentBar />

      {config.showProducts ? (
        <section className="mt-3 grid gap-3 xl:grid-cols-[1.68fr_0.98fr]">
          <FeaturedProducts selectedCategory={selectedCategory} products={activeProducts} />
          <CategoryGrid
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>
      ) : null}

      {config.showOffers ? <PromoBanners offers={activeOffers} /> : null}
      <RewardsStrip />
      <Testimonials />
    </div>
  );
}
