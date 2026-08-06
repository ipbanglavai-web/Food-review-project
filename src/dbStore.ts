import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  setDoc, 
  deleteDoc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { db, seedDatabase } from './firebase';
import { Review, Offer, Moderator, Category, Banner, AppSettings, ContactMessage } from './types';

// Let's create a fallback mock storage in localStorage in case firebase experiences lag or is blocked
const LOCAL_STORAGE_KEY = 'food_review_bd_local_data';

interface LocalState {
  reviews: Review[];
  offers: Offer[];
  moderators: Moderator[];
  categories: Category[];
  banners: Banner[];
  settings: AppSettings;
  messages: ContactMessage[];
}

// Initial default state for local fallback and cache
const INITIAL_STATE: LocalState = {
  banners: [],
  categories: [
    { id: "cat-biriyani", name: "Best Biriyani", type: "food", order: 1 },
    { id: "cat-fastfood", name: "Fast Food", type: "food", order: 2 },
    { id: "cat-burger", name: "Burger", type: "food", order: 3 },
    { id: "cat-pizza", name: "Pizza", type: "food", order: 4 },
    { id: "cat-chinese", name: "Chinese", type: "food", order: 5 },
    { id: "cat-bbq", name: "BBQ", type: "food", order: 6 },
    { id: "cat-cafe", name: "Cafe", type: "food", order: 7 },
    { id: "cat-dessert", name: "Dessert", type: "food", order: 8 },
    { id: "cat-streetfood", name: "Street Food", type: "food", order: 9 },
    { id: "cat-drinks", name: "Drinks", type: "food", order: 10 },
    { id: "cat-seafood", name: "Sea Food", type: "food", order: 11 }
  ],
  reviews: [
    {
      id: "review-1",
      restaurantName: "Sultan's Dine",
      foodCategory: "Best Biriyani",
      rating: 4.9,
      thumbnail: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&h=400&fit=crop",
      thumbnailClickLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "<p>Sultan's Dine has set the gold standard for Kacchi Biriyani in Dhaka. The rich aroma of Basmati rice combined with perfectly slow-cooked premium mutton creates a melt-in-the-mouth experience. Accompanied by their legendary Borhani and sweet Jorda, it is an absolute feast.</p><p>We highly recommend trying their special Mutton Kacchi with extra Alubokhara. The meat is extremely tender, separating from the bone effortlessly. The spices are perfectly balanced, not overly greasy, and represent the true traditional taste of Old Dhaka.</p>",
      shortDescription: "The absolute gold standard of Kacchi Biriyani in Dhaka with melt-in-the-mouth mutton and flavorful long-grain Basmati rice.",
      location: "Dhanmondi, Dhaka (Near Satmasjid Road)",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      facebookUrl: "https://www.facebook.com/sultansdine",
      youtubeUrl: "https://www.youtube.com/sultansdine",
      tags: ["Kacchi", "Biriyani", "Mutton", "Dhanmondi", "Sultan's Dine"],
      featured: true,
      publishDate: "2026-07-28T12:00:00Z",
      views: 3240,
      likes: 890,
      seoTitle: "Sultan's Dine Kacchi Biriyani Review - Dhanmondi",
      seoDescription: "An in-depth review of Sultan's Dine Mutton Kacchi in Dhanmondi. Discover ratings, pricing details, and overall food quality.",
      adminName: "Abrar Chowdhury"
    },
    {
      id: "review-2",
      restaurantName: "Chillox",
      foodCategory: "Burger",
      rating: 4.7,
      thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&h=400&fit=crop",
      thumbnailClickLink: "https://www.facebook.com",
      description: "<p>Chillox is the undisputed king of fast-casual burgers in Bangladesh. Their Beef Cheese Burger features an exceptionally juicy double patty, melted cheddar, crisp onions, and their highly guarded secret house sauce.</p><p>The bun is toasted to golden perfection and holds the juicy mess together nicely. Pair it with their spicy French fries and a refreshing Oreo Shake for the ultimate indulgence. Highly recommended for late-night cravings or quick hangouts with friends.</p>",
      shortDescription: "Juicy, double-patty beef burger layered with melted cheese and rich secret sauce. High value for money!",
      location: "Banani, Dhaka (Road 11)",
      videoUrl: "",
      facebookUrl: "https://www.facebook.com/chillox",
      youtubeUrl: "",
      tags: ["Burger", "Beef Patty", "Fast Food", "Banani", "Chillox"],
      featured: true,
      publishDate: "2026-07-30T15:30:00Z",
      views: 1980,
      likes: 524,
      seoTitle: "Chillox Burger Banani Honest Review - Dhaka",
      seoDescription: "Is Chillox still Dhaka's best burger spot? Read our full expert review of the double beef cheese burger at Banani Road 11.",
      adminName: "Nafis Kamal"
    },
    {
      id: "review-3",
      restaurantName: "Pizza Express",
      foodCategory: "Pizza",
      rating: 4.6,
      thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&h=400&fit=crop",
      thumbnailClickLink: "https://www.youtube.com",
      description: "<p>If you're seeking true thin-crust Italian-style woodfired pizza in Dhaka, Pizza Express is a top contender. Their Spicy Beef Pepperoni Pizza has a beautifully blistered crust with a satisfying chew.</p><p>The marinara is bright and tangy, and they don't skimp on the mozzarella or premium pepperoni slices. A splash of their chili oil takes this pie to a whole new level of deliciousness.</p>",
      shortDescription: "Authentic thin-crust woodfired pizza with crispy blistered edges, premium pepperoni, and high-quality cheese.",
      location: "Gulshan-2, Dhaka",
      videoUrl: "https://www.youtube.com",
      facebookUrl: "https://www.facebook.com/pizzaexpress",
      youtubeUrl: "https://www.youtube.com",
      tags: ["Pizza", "Italian", "Pepperoni", "Gulshan", "Woodfired"],
      featured: false,
      publishDate: "2026-07-25T08:15:00Z",
      views: 1120,
      likes: 245,
      seoTitle: "Best Woodfired Pizza in Dhaka - Pizza Express Review",
      seoDescription: "Read our review of Pizza Express Gulshan. Perfect thin crust pepperoni pizza with fresh cheese and homemade chili oil.",
      adminName: "Abrar Chowdhury"
    },
    {
      id: "review-4",
      restaurantName: "Kacchi Bhai",
      foodCategory: "Best Biriyani",
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600&h=400&fit=crop",
      thumbnailClickLink: "https://www.youtube.com",
      description: "<p>Kacchi Bhai has completely disrupted the budget-friendly Kacchi scene in Bangladesh. Their signature Mutton Kacchi with Basmati rice features tender mutton pieces wrapped in fragrant spices and perfectly cooked potatoes.</p><p>The serving size is generous, making it highly popular among students and families. Don't forget to order their signature Badam Sharbat to round off your meal!</p>",
      shortDescription: "The absolute crowd-favorite budget Kacchi Biriyani with robust flavors and tender marinated mutton.",
      location: "Bailey Road, Dhaka",
      videoUrl: "https://www.youtube.com",
      facebookUrl: "https://www.facebook.com/kacchibhai",
      youtubeUrl: "",
      tags: ["Kacchi", "Biriyani", "Mutton", "Bailey Road", "Kacchi Bhai"],
      featured: false,
      publishDate: "2026-08-01T10:00:00Z",
      views: 4320,
      likes: 1205,
      seoTitle: "Kacchi Bhai Bailey Road Review - Fragrant Basmati Kacchi",
      seoDescription: "Reviewing Kacchi Bhai on Bailey Road. Outstanding flavor-to-price ratio. Best pocket-friendly Kacchi in Dhaka.",
      adminName: "Nafis Kamal"
    },
    {
      id: "review-5",
      restaurantName: "Secret Recipe",
      foodCategory: "Dessert",
      rating: 4.5,
      thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&h=400&fit=crop",
      thumbnailClickLink: "https://www.youtube.com",
      description: "<p>Secret Recipe remains a reliable spot for high-end cakes and fine dining. Their Chocolate Indulgence cake is a masterpiece, featuring layers of premium dark chocolate mousse, white chocolate, and a sponge base.</p><p>It is rich, velvety, and has just the right level of sweetness. Perfect for celebrating birthdays or simply pampering your sweet tooth.</p>",
      shortDescription: "Decadent multi-layered chocolate mousse cake with a rich cocoa flavor and silky smooth texture.",
      location: "Uttara Sector 3, Dhaka",
      videoUrl: "",
      facebookUrl: "https://www.facebook.com",
      youtubeUrl: "",
      tags: ["Dessert", "Cake", "Chocolate", "Uttara", "Secret Recipe"],
      featured: false,
      publishDate: "2026-07-22T14:20:00Z",
      views: 890,
      likes: 198,
      seoTitle: "Secret Recipe Cake Review - Chocolate Indulgence Dhaka",
      seoDescription: "A review of Dhaka's favorite premium cake spot, Secret Recipe. We taste test the iconic Chocolate Indulgence cake.",
      adminName: "Abrar Chowdhury"
    },
    {
      id: "review-6",
      restaurantName: "Kozmo Lounge",
      foodCategory: "Cafe",
      rating: 4.4,
      thumbnail: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&h=400&fit=crop",
      thumbnailClickLink: "https://www.youtube.com",
      description: "<p>Kozmo Lounge offers a wonderful, relaxed ambiance perfect for remote work or cozy conversations. Their Spanish Latte is expertly crafted with premium espresso and sweet condensed milk.</p><p>Pair it with their toasted Club Sandwich or Garlic Mushroom for a delicious afternoon snack. The service is prompt and the Wi-Fi is blazing fast.</p>",
      shortDescription: "A perfect neighborhood cafe serving rich specialty coffee, fresh bakery, and delightful snacks in a beautiful visual space.",
      location: "Dhanmondi, Dhaka",
      videoUrl: "",
      facebookUrl: "https://www.facebook.com",
      youtubeUrl: "",
      tags: ["Cafe", "Coffee", "Latte", "Dhanmondi", "Kozmo Lounge"],
      featured: false,
      publishDate: "2026-07-20T11:00:00Z",
      views: 750,
      likes: 130,
      seoTitle: "Kozmo Lounge Coffee Review - Relaxed Cafe Dhanmondi",
      seoDescription: "Looking for a great workspace cafe in Dhanmondi? Our review of Kozmo Lounge coffee, snacks, and overall ambiance.",
      adminName: "Nafis Kamal"
    }
  ],
  offers: [
    {
      id: "offer-1",
      restaurantName: "Sultan's Dine",
      thumbnail: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&h=400&fit=crop",
      caption: "Get Flat 15% Off on Mutton Kacchi Platters!",
      couponCode: "KACCHI15",
      shortDescription: "Enjoy 15% discount on our legendary Mutton Kacchi with Borhani for dine-in and takeaway at all branches.",
      discountPercentage: 15,
      expiryDate: "2026-12-31",
      category: "Best Biriyani",
      location: "Dhanmondi, Uttara & Gulshan, Dhaka",
      featured: true,
      status: "active",
      adminName: "Abrar Chowdhury"
    },
    {
      id: "offer-2",
      restaurantName: "Chillox",
      thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&h=400&fit=crop",
      caption: "Buy 1 Get 1 Free on Double Beef Cheese Burgers!",
      couponCode: "CHILLBOGO",
      shortDescription: "Purchase any double beef burger and get another double beef cheese burger absolutely free. Valid only on weekdays.",
      discountPercentage: 50,
      expiryDate: "2026-09-30",
      category: "Burger",
      location: "Banani, Mirpur, Uttara & Dhanmondi, Dhaka",
      featured: true,
      status: "active",
      adminName: "Nafis Kamal"
    },
    {
      id: "offer-3",
      restaurantName: "Pizza Express",
      thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&h=400&fit=crop",
      caption: "Flat 20% Off on Any 12-inch Woodfired Pizza!",
      couponCode: "PIZZA20",
      shortDescription: "Treat yourself to our signature woodfired pizzas with a flat 20% discount. Valid for online orders and dine-in.",
      discountPercentage: 20,
      expiryDate: "2026-10-15",
      category: "Pizza",
      location: "Gulshan-2 & Uttara Branch, Dhaka",
      featured: false,
      status: "active",
      adminName: "Abrar Chowdhury"
    },
    {
      id: "offer-4",
      restaurantName: "Secret Recipe",
      thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&h=400&fit=crop",
      caption: "Flat 20% Off on Signature Cakes & Coffee!",
      couponCode: "UTTARA20",
      shortDescription: "Special discount on Chocolate Indulgence and coffees for Uttara branch customers.",
      discountPercentage: 20,
      expiryDate: "2026-11-30",
      category: "Dessert",
      location: "Uttara Sector 3, Dhaka",
      featured: true,
      status: "active",
      adminName: "Abrar Chowdhury"
    }
  ],
  moderators: [
    {
      id: "mod-1",
      name: "Abrar Chowdhury",
      phone: "01712345678",
      email: "admin@admin.com",
      nid: "1994261234567",
      role: "admin",
      status: "active"
    },
    {
      id: "mod-2",
      name: "Nafis Kamal",
      phone: "01812345679",
      email: "nafis@foodreview.com",
      nid: "1997261234568",
      role: "moderator",
      status: "active"
    }
  ],
  settings: {
    desktopLogo: "",
    mobileLogo: "",
    footerDesktopLogo: "",
    footerMobileLogo: "",
    siteName: "Food Review Bangladesh",
    description: "The premier platform for authentic food reviews, trusted culinary suggestions, and exclusive restaurant discounts across Bangladesh. Handpicked and reviewed by food experts.",
    contactAddress: "Road 11, Banani Commercial Area, Dhaka - 1213, Bangladesh",
    contactEmail: "support@foodreviewbd.com",
    contactPhone: "+880 1712-345678",
    facebookUrl: "https://facebook.com",
    youtubeUrl: "https://youtube.com",
    instagramUrl: "https://instagram.com",
    twitterUrl: "https://twitter.com",

    // Default About Us Page details
    aboutEyebrow: "Who We Are",
    aboutTitle: "About Food Review Bangladesh",
    aboutDescription: "We are Bangladesh's premier, independent culinary community. Our staff and moderators travel across the country to bring you unbiased reviews, high-definition videos, and exclusive discount coupons.",
    aboutCard1Title: "Unbiased Ratings",
    aboutCard1Desc: "We pay for our meals. Our reviews represent honest assessments of quality, price, and cleanliness.",
    aboutCard2Title: "Trusted Coupons",
    aboutCard2Desc: "We coordinate directly with restaurant managements to offer real, working discount codes.",
    aboutCard3Title: "Local Cuisines",
    aboutCard3Desc: "From Old Dhaka's traditional Kacchi Biriyani to Banani's gourmet burgers, we cover everything.",
    aboutStoryTitle: "Our Culinary Journey",
    aboutStoryParagraph1: "Food Review Bangladesh started as a small group of passionate food critics in Dhaka. Realizing there was no single resource compiling both detailed text write-ups, video walkthroughs, and verified discount coupons in a beautiful visual interface, we built this premium restaurant platform.",
    aboutStoryParagraph2: "Today, our platform has verified over 150 restaurants, saved users hundreds of thousands of BDT in discount coupon redemptions, and expanded to represent cities beyond Dhaka, including Chittagong, Sylhet, and Rajshahi.",

    copyrightText: "© 2026 Food Review Bangladesh. All Rights Reserved.",
    developerName: "ITology",
    developerUrl: "https://itologybd.com"
  },
  messages: [
    {
      id: "msg-1",
      name: "Tanvir Ahmed",
      email: "tanvir.burgers@gmail.com",
      phone: "+880 1711-223344",
      subject: "Restaurant Review Request for Burger King Banani",
      message: "Hello Food Review BD team, we recently opened our gourmet burger lounge in Banani Road 11 and would love to invite your reviewer team for an honest review and video feature.",
      submittedAt: "2026-08-02T10:30:00Z",
      read: false
    },
    {
      id: "msg-2",
      name: "Sadiya Rahman",
      email: "sadiya@pizzaguild.bd",
      phone: "+880 1819-887766",
      subject: "Discount Coupon Partnership Inquiry",
      message: "Hi! We are offering a 20% discount coupon for all Food Review Bangladesh users at Woodfired Pizza Express. Please let us know how we can publish this coupon offer on your site.",
      submittedAt: "2026-08-01T15:45:00Z",
      read: true
    },
    {
      id: "msg-3",
      name: "Abrar Chowdhury",
      email: "abrar.chowdhury@yahoo.com",
      phone: "+880 1912-345678",
      subject: "Feedback regarding Kacchi Biriyani ratings",
      message: "Great work on the Sultan's Dine review! The video link was super helpful. Keep up the authentic reviews!",
      submittedAt: "2026-07-31T09:12:00Z",
      read: true
    }
  ]
};

// Global cache in memory initialized from localStorage immediately
let cachedState: LocalState = (() => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_STATE,
        ...parsed,
        settings: { ...INITIAL_STATE.settings, ...(parsed.settings || {}) }
      };
    }
  } catch (e) {}
  return { ...INITIAL_STATE };
})();

function withTimeout<T>(promise: Promise<T>, ms: number = 3000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out')), ms)
    )
  ]);
}

// Initialize data store from Firestore or LocalStorage
export async function initializeStore(): Promise<void> {
  try {
    // Attempt to seed first with timeout
    await withTimeout(seedDatabase(), 2500).catch((e) => {
      console.warn("Database seed skipped or timed out:", e);
    });

    // Fetch Banners
    const bannersSnap = await withTimeout(getDocs(collection(db, 'banners')), 2500);
    if (!bannersSnap.empty) {
      cachedState.banners = bannersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner)).sort((a,b) => a.order - b.order);
    } else if (cachedState.banners.length === 0) {
      cachedState.banners = [...INITIAL_STATE.banners];
    }

    // Fetch Categories
    const categoriesSnap = await withTimeout(getDocs(collection(db, 'categories')), 2500);
    if (!categoriesSnap.empty) {
      const cats = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      const fallbackMap: Record<string, number> = {
        'cat-biriyani': 1, 'cat-fastfood': 2, 'cat-burger': 3, 'cat-pizza': 4,
        'cat-chinese': 5, 'cat-bbq': 6, 'cat-cafe': 7, 'cat-dessert': 8,
        'cat-streetfood': 9, 'cat-drinks': 10, 'cat-seafood': 11
      };
      cats.sort((a, b) => {
        const orderA = a.order ?? fallbackMap[a.id] ?? 99;
        const orderB = b.order ?? fallbackMap[b.id] ?? 99;
        return orderA - orderB;
      });
      cachedState.categories = cats;
    } else if (cachedState.categories.length === 0) {
      cachedState.categories = [...INITIAL_STATE.categories];
    }

    // Load existing local cache first if available
    const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let localCache: LocalState | null = null;
    if (localRaw) {
      try {
        localCache = JSON.parse(localRaw);
      } catch (e) {}
    }

    // Fetch Reviews
    const reviewsSnap = await withTimeout(getDocs(collection(db, 'reviews')), 2500);
    if (!reviewsSnap.empty) {
      const fetchedReviews = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      cachedState.reviews = fetchedReviews.map(fRev => {
        const localRev = localCache?.reviews?.find(r => r.id === fRev.id);
        if (localRev) {
          return {
            ...fRev,
            likes: Math.max(fRev.likes || 0, localRev.likes || 0),
            views: Math.max(fRev.views || 0, localRev.views || 0),
          };
        }
        return fRev;
      });
    } else if (cachedState.reviews.length === 0) {
      cachedState.reviews = [...INITIAL_STATE.reviews];
    }

    // Fetch Offers
    const offersSnap = await withTimeout(getDocs(collection(db, 'offers')), 2500);
    if (!offersSnap.empty) {
      cachedState.offers = offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
    } else if (cachedState.offers.length === 0) {
      cachedState.offers = [...INITIAL_STATE.offers];
    }

    // Fetch Moderators
    const modsSnap = await withTimeout(getDocs(collection(db, 'moderators')), 2500);
    if (!modsSnap.empty) {
      cachedState.moderators = modsSnap.docs.map(doc => {
        const d = doc.data();
        return { id: doc.id, ...d } as Moderator;
      });
    } else if (cachedState.moderators.length === 0) {
      cachedState.moderators = [...INITIAL_STATE.moderators];
    }

    // Fetch Settings
    const settingsDoc = await withTimeout(getDoc(doc(db, 'settings', 'app')), 2500);
    if (settingsDoc.exists()) {
      const serverSettings = settingsDoc.data() as AppSettings;
      cachedState.settings = {
        ...INITIAL_STATE.settings,
        ...(localCache?.settings || {}),
        ...serverSettings,
        desktopLogo: serverSettings.desktopLogo || localCache?.settings?.desktopLogo || INITIAL_STATE.settings.desktopLogo,
        mobileLogo: serverSettings.mobileLogo || localCache?.settings?.mobileLogo || INITIAL_STATE.settings.mobileLogo,
        footerDesktopLogo: serverSettings.footerDesktopLogo || localCache?.settings?.footerDesktopLogo || INITIAL_STATE.settings.footerDesktopLogo,
        footerMobileLogo: serverSettings.footerMobileLogo || localCache?.settings?.footerMobileLogo || INITIAL_STATE.settings.footerMobileLogo,
      };
    } else if (localCache?.settings) {
      cachedState.settings = { ...INITIAL_STATE.settings, ...localCache.settings };
    }

    // Fetch Messages
    try {
      const msgsSnap = await withTimeout(getDocs(collection(db, 'messages')), 2500);
      if (!msgsSnap.empty) {
        cachedState.messages = msgsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage))
          .sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      } else if (!cachedState.messages || cachedState.messages.length === 0) {
        cachedState.messages = [...INITIAL_STATE.messages];
      }
    } catch (_) {
      if (!cachedState.messages || cachedState.messages.length === 0) {
        cachedState.messages = [...INITIAL_STATE.messages];
      }
    }

    // Save to localStorage as a cache
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cachedState));
  } catch (error) {
    console.warn("Firestore could not be loaded, using offline local database fallback:", error);
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        cachedState = JSON.parse(local);
      } catch (e) {
        cachedState = { ...INITIAL_STATE };
      }
    } else {
      cachedState = { ...INITIAL_STATE };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cachedState));
    }
  }
}

// Ensure loaded state helper
function saveLocalCache() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cachedState));
}

// EXPORTED GETTERS
export function getBanners(): Banner[] {
  const b = cachedState.banners.length > 0 ? cachedState.banners : INITIAL_STATE.banners;
  return [...b].sort((a, b) => a.order - b.order);
}

export function getCategories(): Category[] {
  return cachedState.categories;
}

export function getReviews(): Review[] {
  return cachedState.reviews;
}

export function getOffers(): Offer[] {
  return cachedState.offers;
}

export function getModerators(): Moderator[] {
  return cachedState.moderators;
}

export function getSettings(): AppSettings {
  return cachedState.settings;
}

// VIEWS & LIKES LOGIC
export async function incrementReviewViews(id: string): Promise<number> {
  const viewedKey = `viewed_review_${id}`;
  const alreadyViewed = localStorage.getItem(viewedKey) === 'true';

  const revIndex = cachedState.reviews.findIndex(r => r.id === id);
  if (revIndex === -1) return 0;

  if (alreadyViewed) {
    return cachedState.reviews[revIndex].views;
  }

  localStorage.setItem(viewedKey, 'true');

  // Update in state
  cachedState.reviews[revIndex].views += 1;
  saveLocalCache();

  // Async write to Firebase
  try {
    await updateDoc(doc(db, 'reviews', id), {
      views: increment(1)
    });
  } catch (e) {
    console.warn("Could not increment view in firestore:", e);
  }
  return cachedState.reviews[revIndex].views;
}

export async function toggleReviewLike(id: string): Promise<{ liked: boolean; likes: number }> {
  const likedKey = `liked_review_${id}`;
  const isLiked = localStorage.getItem(likedKey) === 'true';
  const revIndex = cachedState.reviews.findIndex(r => r.id === id);

  if (revIndex === -1) {
    return { liked: false, likes: 0 };
  }

  const review = cachedState.reviews[revIndex];

  if (isLiked) {
    // Unlike
    localStorage.removeItem(likedKey);
    review.likes = Math.max(0, review.likes - 1);
    saveLocalCache();

    try {
      await updateDoc(doc(db, 'reviews', id), {
        likes: increment(-1)
      });
    } catch (e) {
      console.warn("Could not decrement like in firestore:", e);
    }
    return { liked: false, likes: review.likes };
  } else {
    // Like
    localStorage.setItem(likedKey, 'true');
    review.likes += 1;
    saveLocalCache();

    try {
      await updateDoc(doc(db, 'reviews', id), {
        likes: increment(1)
      });
    } catch (e) {
      console.warn("Could not increment like in firestore:", e);
    }
    return { liked: true, likes: review.likes };
  }
}

export function isReviewLikedLocally(id: string): boolean {
  return localStorage.getItem(`liked_review_${id}`) === 'true';
}

// Helper function to sanitize objects before sending to Firestore (strips undefined values)
function cleanData<T extends Record<string, any>>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

// ADMIN CORE FUNCTIONS
export async function saveAppSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  cachedState.settings = { ...cachedState.settings, ...settings };
  saveLocalCache();
  try {
    await setDoc(doc(db, 'settings', 'app'), cleanData(cachedState.settings), { merge: true });
  } catch (e) {
    console.error("Could not save settings to firestore:", e);
    throw e;
  }
  return cachedState.settings;
}

// BANNER MANAGEMENT
export async function addBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
  const newId = `banner-${Date.now()}`;
  const newBanner: Banner = { id: newId, ...banner };
  cachedState.banners.push(newBanner);
  saveLocalCache();
  try {
    await setDoc(doc(db, 'banners', newId), cleanData(newBanner));
  } catch (e) {
    console.error("Firestore error adding banner:", e);
    cachedState.banners = cachedState.banners.filter(b => b.id !== newId);
    saveLocalCache();
    throw e;
  }
  return newBanner;
}

export async function deleteBanner(id: string): Promise<void> {
  cachedState.banners = cachedState.banners.filter(b => b.id !== id);
  saveLocalCache();
  try {
    await deleteDoc(doc(db, 'banners', id));
  } catch (e) {
    console.warn("Firestore error deleting banner:", e);
  }
}

export async function updateBanner(banner: Banner): Promise<Banner> {
  const index = cachedState.banners.findIndex(b => b.id === banner.id);
  const prev = index !== -1 ? { ...cachedState.banners[index] } : null;
  if (index !== -1) {
    cachedState.banners[index] = banner;
    saveLocalCache();
  }
  try {
    await setDoc(doc(db, 'banners', banner.id), cleanData(banner));
  } catch (e) {
    console.error("Firestore error updating banner:", e);
    if (index !== -1 && prev) {
      cachedState.banners[index] = prev;
      saveLocalCache();
    }
    throw e;
  }
  return banner;
}

// CATEGORY MANAGEMENT
export async function addCategory(name: string, type: 'food' | 'restaurant'): Promise<Category> {
  const cleanId = `cat-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  const newCat: Category = { id: cleanId, name, type };
  cachedState.categories.push(newCat);
  saveLocalCache();
  try {
    await setDoc(doc(db, 'categories', cleanId), cleanData(newCat));
  } catch (e) {
    console.error("Firestore error adding category:", e);
    throw e;
  }
  return newCat;
}

export async function deleteCategory(id: string): Promise<void> {
  cachedState.categories = cachedState.categories.filter(c => c.id !== id);
  saveLocalCache();
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (e) {
    console.warn("Firestore error deleting category:", e);
  }
}

export async function updateCategory(cat: Category): Promise<Category> {
  const index = cachedState.categories.findIndex(c => c.id === cat.id);
  if (index !== -1) {
    cachedState.categories[index] = cat;
    saveLocalCache();
  }
  try {
    await setDoc(doc(db, 'categories', cat.id), cleanData(cat));
  } catch (e) {
    console.error("Firestore error updating category:", e);
    throw e;
  }
  return cat;
}

// REVIEW MANAGEMENT
export async function addReview(review: Omit<Review, 'id' | 'views' | 'likes'>): Promise<Review> {
  const newId = `review-${Date.now()}`;
  const newReview: Review = {
    id: newId,
    status: review.status || 'approved',
    ...review,
    views: 0,
    likes: 0
  };
  cachedState.reviews.unshift(newReview);
  saveLocalCache();
  try {
    await setDoc(doc(db, 'reviews', newId), cleanData(newReview));
  } catch (e) {
    console.error("Firestore error adding review:", e);
    throw e;
  }
  return newReview;
}

export async function approveReview(id: string): Promise<Review | null> {
  const index = cachedState.reviews.findIndex(r => r.id === id);
  if (index !== -1) {
    cachedState.reviews[index].status = 'approved';
    const updated = cachedState.reviews[index];
    saveLocalCache();
    try {
      await updateDoc(doc(db, 'reviews', id), { status: 'approved' });
    } catch (e) {
      console.error("Firestore error approving review:", e);
    }
    return updated;
  }
  return null;
}

export async function updateReview(review: Review): Promise<Review> {
  const index = cachedState.reviews.findIndex(r => r.id === review.id);
  if (index !== -1) {
    cachedState.reviews[index] = review;
    saveLocalCache();
  }
  try {
    await setDoc(doc(db, 'reviews', review.id), cleanData(review));
  } catch (e) {
    console.error("Firestore error updating review:", e);
    throw e;
  }
  return review;
}

export async function deleteReview(id: string): Promise<void> {
  cachedState.reviews = cachedState.reviews.filter(r => r.id !== id);
  saveLocalCache();
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (e) {
    console.warn("Firestore error deleting review:", e);
  }
}

// OFFER MANAGEMENT
export async function addOffer(offer: Omit<Offer, 'id'>): Promise<Offer> {
  const newId = `offer-${Date.now()}`;
  const newOffer: Offer = { id: newId, ...offer };
  cachedState.offers.unshift(newOffer);
  saveLocalCache();
  try {
    await setDoc(doc(db, 'offers', newId), cleanData(newOffer));
  } catch (e) {
    console.error("Firestore error adding offer:", e);
    throw e;
  }
  return newOffer;
}

export async function updateOffer(offer: Offer): Promise<Offer> {
  const index = cachedState.offers.findIndex(o => o.id === offer.id);
  if (index !== -1) {
    cachedState.offers[index] = offer;
    saveLocalCache();
  }
  try {
    await setDoc(doc(db, 'offers', offer.id), cleanData(offer));
  } catch (e) {
    console.error("Firestore error updating offer:", e);
    throw e;
  }
  return offer;
}

export async function deleteOffer(id: string): Promise<void> {
  cachedState.offers = cachedState.offers.filter(o => o.id !== id);
  saveLocalCache();
  try {
    await deleteDoc(doc(db, 'offers', id));
  } catch (e) {
    console.warn("Firestore error deleting offer:", e);
  }
}

// MODERATOR MANAGEMENT
export async function addModerator(mod: Omit<Moderator, 'id'>): Promise<Moderator> {
  const newId = `mod-${Date.now()}`;
  const newMod: Moderator = { id: newId, ...mod };
  cachedState.moderators.push(newMod);
  saveLocalCache();
  try {
    await setDoc(doc(db, 'moderators', newId), cleanData(newMod));
  } catch (e) {
    console.error("Firestore error adding moderator:", e);
    throw e;
  }
  return newMod;
}

export async function updateModerator(mod: Moderator): Promise<Moderator> {
  const index = cachedState.moderators.findIndex(m => m.id === mod.id);
  if (index !== -1) {
    cachedState.moderators[index] = mod;
    saveLocalCache();
  }
  try {
    await setDoc(doc(db, 'moderators', mod.id), cleanData(mod));
  } catch (e) {
    console.error("Firestore error updating moderator:", e);
    throw e;
  }
  return mod;
}

export async function deleteModerator(id: string): Promise<void> {
  cachedState.moderators = cachedState.moderators.filter(m => m.id !== id);
  saveLocalCache();
  try {
    await deleteDoc(doc(db, 'moderators', id));
  } catch (e) {
    console.warn("Firestore error deleting moderator:", e);
  }
}

// USER MESSAGES MANAGEMENT
export function getMessages(): ContactMessage[] {
  return cachedState.messages || [];
}

export async function addMessage(msg: Omit<ContactMessage, 'id' | 'submittedAt' | 'read'>): Promise<ContactMessage> {
  const newId = `msg-${Date.now()}`;
  const newMsg: ContactMessage = {
    id: newId,
    ...msg,
    submittedAt: new Date().toISOString(),
    read: false,
  };
  if (!cachedState.messages) cachedState.messages = [];
  cachedState.messages.unshift(newMsg);
  saveLocalCache();
  try {
    await setDoc(doc(db, 'messages', newId), cleanData(newMsg));
  } catch (e) {
    console.error("Firestore error adding message:", e);
  }
  return newMsg;
}

export async function markMessageAsRead(id: string, read: boolean = true): Promise<void> {
  if (!cachedState.messages) return;
  const index = cachedState.messages.findIndex(m => m.id === id);
  if (index !== -1) {
    cachedState.messages[index].read = read;
    saveLocalCache();
  }
  try {
    await updateDoc(doc(db, 'messages', id), { read });
  } catch (e) {
    console.error("Firestore error updating message read status:", e);
  }
}

export async function deleteMessage(id: string): Promise<void> {
  if (!cachedState.messages) return;
  cachedState.messages = cachedState.messages.filter(m => m.id !== id);
  saveLocalCache();
  try {
    await deleteDoc(doc(db, 'messages', id));
  } catch (e) {
    console.warn("Firestore error deleting message:", e);
  }
}

