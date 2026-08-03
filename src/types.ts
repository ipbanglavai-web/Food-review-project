export interface Review {
  id: string;
  restaurantName: string;
  foodCategory: string;
  rating: number; // 1-5
  thumbnail: string;
  thumbnailClickLink: string;
  description: string;
  shortDescription: string;
  location: string;
  videoUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tags: string[];
  featured: boolean;
  publishDate: string; // ISO string
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  adminName: string;
}

export interface Offer {
  id: string;
  restaurantName: string;
  thumbnail: string;
  caption: string;
  couponCode: string;
  shortDescription: string;
  discountPercentage: number;
  expiryDate: string; // YYYY-MM-DD
  category: string;
  featured: boolean;
  status: 'active' | 'inactive';
  adminName: string;
}

export interface Moderator {
  id: string;
  name: string;
  phone: string;
  email: string;
  nid: string;
  password?: string;
  role: 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
}

export interface Category {
  id: string;
  name: string;
  type: 'food' | 'restaurant';
  order?: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
  order: number;
}

export interface AppSettings {
  desktopLogo?: string;
  mobileLogo?: string;
  siteName: string;
  description: string;
}
