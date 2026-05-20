"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { FulfillmentBar } from "@/components/sections/FulfillmentBar";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { RewardsStrip } from "@/components/sections/RewardsStrip";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-[1540px] px-4 py-3 md:px-8 md:py-3">
      <Hero />
      <TrustStrip />
      <FulfillmentBar />

      <section className="mt-3 grid gap-3 xl:grid-cols-[1.68fr_0.98fr]">
        <FeaturedProducts selectedCategory={selectedCategory} />
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      <PromoBanners />
      <RewardsStrip />
      <Testimonials />
    </div>
  );
}
