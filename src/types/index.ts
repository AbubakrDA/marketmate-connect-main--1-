export type UserRole = 'user' | 'business' | 'admin';
export type LeadStatus = 'new' | 'contacted' | 'won' | 'lost';
export type ListingStatus = 'active' | 'inactive' | 'pending';
export type AdStatus = 'active' | 'paused' | 'ended';
export type AdContentType = 'image' | 'video' | 'text';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type SubscriptionPlan = 'free' | 'pro';
export type BuyerRequestStatus = 'open' | 'matched' | 'closed';
export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface Business {
  id: string;
  ownerUserId: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  phone: string;
  email: string;
  area: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Listing {
  id: string;
  businessId: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  area: string;
  city: string;
  priceEgp: number;
  oldPriceEgp?: number;
  dealLabel?: string;
  imageUrl: string;
  images?: string[];
  videoUrl?: string;
  status: ListingStatus;
  createdAt: string;
  business?: Business;
}

export interface Lead {
  id: string;
  listingId: string;
  businessId: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  businessId?: string;
  userId?: string;
  type: 'pricing' | 'area' | 'improvement' | 'promotion' | 'listing';
  title: string;
  description: string;
  score: number;
  createdAt: string;
}

export interface AdCampaign {
  id: string;
  businessId: string;
  title: string;
  description?: string;
  contentType?: AdContentType;
  imageUrl?: string;
  videoUrl?: string;
  callToAction?: string;
  linkUrl?: string;
  budgetEgp: number;
  status: AdStatus;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  businessId: string;
  planName: SubscriptionPlan;
  monthlyPriceEgp: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}

export interface UserInterest {
  id: string;
  userId: string;
  category: string;
  subCategory?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

// ===== NEW TYPES =====

export interface BuyerRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  city: string;
  area: string;
  minPrice?: number;
  maxPrice?: number;
  dateNeeded?: string;
  status: BuyerRequestStatus;
  createdAt: string;
}

export interface Offer {
  id: string;
  requestId: string;
  businessId: string;
  offerTitle: string;
  offerMessage: string;
  offerPrice: number;
  listingReference?: string;
  status: OfferStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  requestId?: string;
  offerId?: string;
  participants: string[]; // user IDs
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface DealHunter {
  id: string;
  userId: string;
  label: string;
  category: string;
  subCategory?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  createdAt: string;
}

export interface SaleCampaign {
  id: string;
  businessId: string;
  title: string;
  description: string;
  category: string;
  season: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface UserWallet {
  id: string;
  userId: string;
  requestCredits: number;
  freeRequestsUsed: number;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit_purchase' | 'subscription' | 'ad_payment';
  description: string;
  createdAt: string;
}

export const CATEGORIES = ['Clinics', 'Real Estate', 'Fashion'] as const;

export const SUBCATEGORIES: Record<string, string[]> = {
  'Clinics': ['General Practice', 'Dental', 'Ophthalmology', 'Pediatrics', 'Dermatology'],
  'Real Estate': ['Apartments', 'Villas', 'Offices', 'Studios', 'Commercial'],
  'Fashion': ['Women', 'Men', 'Kids', 'Traditional', 'Accessories'],
};

export const AREAS = ['Maadi', 'Zamalek', 'Nasr City', 'New Cairo', '6th October', 'Heliopolis', 'Downtown', 'Dokki', 'Mohandessin'] as const;
export const CITIES = ['Cairo', 'Giza', 'Alexandria'] as const;

export const SEASONS = ['Winter Sale', 'Ramadan Offers', 'Back to School', 'Black Friday', 'Summer Sale'] as const;

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
