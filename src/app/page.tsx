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
  const { products, offers, config, pageLayout } = useStorefrontContent();
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

  const isSectionVisible = useCallback(
    (type: string) => pageLayout.sections.find((section) => section.type === type)?.visible !== false,
    [pageLayout.sections],
  );

  const orderedSections = useMemo(
    () => [...pageLayout.sections].filter((section) => section.visible !== false).sort((a, b) => a.order - b.order),
    [pageLayout.sections],
  );

  const renderSection = useCallback(
    (sectionType: string, index: number) => {
      if (sectionType === "hero") {
        return <Hero key={`hero-${index}`} />;
      }

      if (sectionType === "fulfillment") {
        return <FulfillmentBar key={`fulfillment-${index}`} />;
      }

      if (sectionType === "products") {
        if (!config.showProducts) {
          return null;
        }

        const showCategories = isSectionVisible("categories");
        if (showCategories) {
          return (
            <section key={`products-${index}`} className="mt-3 grid gap-3 xl:grid-cols-[1.68fr_0.98fr]">
              <FeaturedProducts selectedCategory={selectedCategory} products={activeProducts} />
              <CategoryGrid
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                availableCategories={availableCategories}
              />
            </section>
          );
        }

        return (
          <section key={`products-${index}`} className="mt-3">
            <FeaturedProducts selectedCategory={selectedCategory} products={activeProducts} />
          </section>
        );
      }

      if (sectionType === "categories") {
        if (!config.showProducts || isSectionVisible("products")) {
          return null;
        }

        return (
          <section key={`categories-${index}`} className="mt-3">
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              availableCategories={availableCategories}
            />
          </section>
        );
      }

      if (sectionType === "promos") {
        if (!config.showOffers) {
          return null;
        }
        return <PromoBanners key={`promos-${index}`} offers={activeOffers} onCtaClick={handlePromoCta} />;
      }

      if (sectionType === "testimonials") {
        return <Testimonials key={`testimonials-${index}`} />;
      }

      return null;
    },
    [
      activeOffers,
      activeProducts,
      availableCategories,
      config.showOffers,
      config.showProducts,
      handlePromoCta,
      isSectionVisible,
      selectedCategory,
    ],
  );

  return (
    <div className="mx-auto w-full max-w-[1540px] px-4 py-3 md:px-8 md:py-3">
      {orderedSections.map((section, index) => renderSection(section.type, index))}
    </div>
  );
}
