import { PromoItem } from "@/types";

export const promos: PromoItem[] = [
  {
    id: "deal-week",
    eyebrow: "DEAL OF THE WEEK",
    title: "30% OFF",
    subtitle: "SELECT TOP SHELF FLOWER",
    cta: "SHOP THE DEAL",
    image: "/images/promo-deal-week.jpg",
  },
  {
    id: "new-customer",
    eyebrow: "NEW CUSTOMER SPECIAL",
    title: "25% OFF",
    subtitle: "YOUR FIRST ORDER",
    cta: "USE CODE: ELEVATE25",
    code: "ELEVATE25",
    image: "/images/promo-new-customer.jpg",
  },
  {
    id: "happy-hour",
    eyebrow: "DAILY HAPPY HOUR",
    title: "20% OFF",
    subtitle: "EVERYDAY 3PM - 6PM",
    cta: "SHOP NOW",
    image: "/images/promo-happy-hour.jpg",
  },
];
