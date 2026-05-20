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

export interface PromoItem {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  code?: string;
  image: string;
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
