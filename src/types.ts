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
  status?: 'approved' | 'pending';
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
  subtitle?: string;
  description?: string;
  order: number;
}

export interface AppSettings {
  desktopLogo?: string;
  mobileLogo?: string;
  siteName: string;
  description: string;
  contactAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;

  // About Us Page Details
  aboutEyebrow?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutCard1Title?: string;
  aboutCard1Desc?: string;
  aboutCard2Title?: string;
  aboutCard2Desc?: string;
  aboutCard3Title?: string;
  aboutCard3Desc?: string;
  aboutStoryTitle?: string;
  aboutStoryParagraph1?: string;
  aboutStoryParagraph2?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt: string; // ISO date string
  read: boolean;
}

