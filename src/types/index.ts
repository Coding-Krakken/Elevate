export type StrainType = "HYBRID" | "SATIVA" | "INDICA";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  strain: StrainType;
  description: string;
  thc: string;
  price: number;
  size: string;
  image: string;
  imagePosition?: string;
}

export interface CategoryItem {
  id: string;
  label: string;
  slug: string;
  icon: string;
}

export interface PromoItem {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  code?: string;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  quote: string;
  rating: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}
