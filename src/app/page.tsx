"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { FulfillmentBar } from "@/components/sections/FulfillmentBar";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { Testimonials } from "@/components/sections/Testimonials";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import { useSiteStore } from "@/hooks/useSiteStore";
import type { PromoItem } from "@/types";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products, offers, config } = useStorefrontContent();
  const { applyManualDeal, toggleCart } = useSiteStore();

  const activeProducts = products.filter((product) => product.isActive);
  const activeOffers = offers.filter((offer) => offer.isActive);
  const availableCategories = useMemo(
    () => Array.from(new Set(activeProducts.map((product) => product.category))),
    [activeProducts],
  );

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }
    if (availableCategories.includes(selectedCategory)) {
      return;
    }
    setSelectedCategory(null);
  }, [availableCategories, selectedCategory]);

  const handlePromoCta = useCallback(
    (promo: PromoItem) => {
      if (promo.rules?.allowManualApply || promo.rules?.autoApply) {
        applyManualDeal(promo.id);
      }
      toggleCart();
    },
    [applyManualDeal, toggleCart],
  );

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
            availableCategories={availableCategories}
          />
        </section>
      ) : null}

      {config.showOffers ? <PromoBanners offers={activeOffers} onCtaClick={handlePromoCta} /> : null}
      <Testimonials />
    </div>
  );
}
