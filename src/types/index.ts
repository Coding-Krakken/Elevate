export type StrainType = "HYBRID" | "SATIVA" | "INDICA";

export interface ProductQuantityOption {
  id: string;
  label: string;
  price: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  strain: StrainType;
  description: string;
  thc: string;
  quantities: ProductQuantityOption[];
  image: string;
  imagePosition?: string;
}

export interface ManagedProduct extends Product {
  isActive: boolean;
}

export interface CategoryItem {
  id: string;
  label: string;
  slug: string;
  icon: string;
}

export type OfferDiscountType = "percent" | "fixed";

export interface OfferRules {
  autoApply: boolean;
  allowManualApply: boolean;
  discountType: OfferDiscountType;
  discountValue: number;
  minSubtotal?: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
}

export interface PromoItem {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  code?: string;
  image: string;
  rules?: OfferRules;
}

export interface ManagedOffer extends PromoItem {
  isActive: boolean;
}

export interface StorefrontConfig {
  pageTitle: string;
  pageSubtitle: string;
  showProducts: boolean;
  showOffers: boolean;
}

export interface Review {
  id: string;
  name: string;
  quote: string;
  rating: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantityId: string;
  name: string;
  optionLabel: string;
  price: number;
  image: string;
  quantity: number;
}

export interface AppliedCartDeal {
  id: string;
  title: string;
  amount: number;
  source: "auto" | "manual";
}

// Device Registration & Invitation Types

export interface InvitationLink {
  id: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  usedAt: Date | null;
  deviceId: string | null;
}

export interface RegisteredDevice {
  id: string;
  fingerprint: string;
  tokenHash: string;
  registeredAt: Date;
  lastAccessAt: Date;
  revokedAt: Date | null;
}

export interface AdminDevice {
  id: string;
  deviceId: string;
  email: string | null;
  createdAt: Date;
}

export interface InvitationResponse {
  success: boolean;
  inviteUrl?: string;
  token?: string;
  expiresAt?: Date;
  error?: string;
}

export interface DeviceVerificationResponse {
  success: boolean;
  isRegistered: boolean;
  error?: string;
}

export interface DeviceRegistrationResponse {
  success: boolean;
  error?: string;
  errorCode?: 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'USED_TOKEN' | 'REGISTRATION_FAILED';
}

// Visual Editor Types

export interface SectionConfig {
  id: string;
  type:
    | "topBar"
    | "header"
    | "hero"
    | "fulfillment"
    | "products"
    | "categories"
    | "promos"
    | "testimonials"
    | "trust"
    | "rewards"
    | "footer";
  visible: boolean;
  order: number;
  label?: string;
}

export interface PageLayout {
  sections: SectionConfig[];
}

export interface HomepageContent {
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    primaryCta: string;
    primaryCtaHref: string;
    secondaryCta: string;
    secondaryCtaHref: string;
    scriptLine1: string;
    scriptLine2: string;
    highlights: string[];
    backgroundImage?: string;
  };
  fulfillment: {
    items: { title: string; subtitle: string }[];
    rating: string;
    reviewsLabel: string;
  };
  topBar: {
    text: string;
  };
  header: {
    brandLine1: string;
    brandLine2: string;
    logoHref: string;
    accountHref: string;
  };
  footer: {
    tagline: string;
    columnTitle: string;
    links: { label: string; href: string }[];
    disclaimer: string;
    copyright: string;
  };
  testimonials: {
    viewAllLabel: string;
    viewAllHref: string;
    prevLabel: string;
    nextLabel: string;
  };
  categories: {
    viewAllLabel: string;
  };
}

export interface StorefrontContent {
  config: StorefrontConfig;
  products: ManagedProduct[];
  offers: ManagedOffer[];
  homepage: HomepageContent;
  testimonials: Review[];
  categories: CategoryItem[];
  pageLayout: PageLayout;
  styleOverrides?: Record<string, ElementStyleOverrides>;
}

export interface ElementStyleOverrides {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
  letterSpacing?: string;
  lineHeight?: string;
  backgroundColor?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  opacity?: number;
  boxShadow?: string;
  objectFit?: "cover" | "contain" | "fill";
  objectPosition?: string;
  imageAlt?: string;
}

export type EditorElementType = "text" | "image" | "section" | "product" | "offer" | "category" | "testimonial";

export interface SelectedElement {
  id: string;
  type: EditorElementType;
  sectionId: string;
  path: string;
  rect?: DOMRect;
}
