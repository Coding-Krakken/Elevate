import { PromoItem } from "@/types";

export const promos: PromoItem[] = [
  {
    id: "deal-week",
    eyebrow: "DEAL OF THE WEEK",
    title: "30% OFF",
    subtitle: "SELECT TOP SHELF FLOWER",
    cta: "SHOP THE DEAL",
    image: "/images/promo-deal-week.jpg",
    rules: {
      autoApply: true,
      allowManualApply: true,
      discountType: "percent",
      discountValue: 30,
      minSubtotal: 50,
    },
  },
  {
    id: "new-customer",
    eyebrow: "NEW CUSTOMER SPECIAL",
    title: "25% OFF",
    subtitle: "YOUR FIRST ORDER",
    cta: "USE CODE: SYRACUSE25",
    code: "SYRACUSE25",
    image: "/images/promo-new-customer.jpg",
    rules: {
      autoApply: false,
      allowManualApply: true,
      discountType: "percent",
      discountValue: 25,
    },
  },
  {
    id: "happy-hour",
    eyebrow: "DAILY HAPPY HOUR",
    title: "20% OFF",
    subtitle: "EVERYDAY 3PM - 6PM",
    cta: "SHOP NOW",
    image: "/images/promo-happy-hour.jpg",
    rules: {
      autoApply: true,
      allowManualApply: true,
      discountType: "percent",
      discountValue: 20,
      startTime: "15:00",
      endTime: "18:00",
    },
  },
];
