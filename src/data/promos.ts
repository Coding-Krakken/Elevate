import { PromoItem } from "@/types";

export const promos: PromoItem[] = [
  {
    id: "deal-week",
    eyebrow: "DEAL OF THE WEEK",
    title: "30% OFF",
    subtitle: "SELECT TOP SHELF FLOWER",
    cta: "SHOP THE DEAL",
    image:
      "https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "new-customer",
    eyebrow: "NEW CUSTOMER SPECIAL",
    title: "25% OFF",
    subtitle: "YOUR FIRST ORDER",
    cta: "USE CODE: ELEVATE25",
    code: "ELEVATE25",
    image:
      "https://images.unsplash.com/photo-1611242320536-f12d3541249b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "happy-hour",
    eyebrow: "DAILY HAPPY HOUR",
    title: "20% OFF",
    subtitle: "EVERYDAY 3PM - 6PM",
    cta: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80",
  },
];
