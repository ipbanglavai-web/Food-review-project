import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, collection, getDocs, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';

// Configuration from generated Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyC9_9iOctGG6cY3upBkgJrAU3WrT__DghA",
  authDomain: "foodproject-ad2bd.firebaseapp.com",
  projectId: "foodproject-ad2bd",
  storageBucket: "foodproject-ad2bd.firebasestorage.app",
  messagingSenderId: "895633123121",
  appId: "1:895633123121:web:f5cc2e2a67bf205cb4b210",
  measurementId: "G-6M8N6CF935"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with auto-detect long polling for reliable web container connectivity
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

export const auth = getAuth(app);

// Seed data definitions
const DEFAULT_BANNERS = [
  {
    id: "banner-1",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1600&h=900&fit=crop",
    linkUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Sultan's Dine Legendary Kacchi Biriyani - The Taste of Dhaka",
    order: 1
  },
  {
    id: "banner-2",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600&h=900&fit=crop",
    linkUrl: "https://www.facebook.com",
    title: "Chillox Ultimate Smoky Burgers - Dhaka's Favorite Burger Joint",
    order: 2
  },
  {
    id: "banner-3",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&h=900&fit=crop",
    linkUrl: "https://www.youtube.com",
    title: "Woodfired Pizza Express - Crispy, Cheesy & Hot Fresh Out of Oven",
    order: 3
  }
];

const DEFAULT_CATEGORIES = [
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
];

const DEFAULT_REVIEWS = [
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
];

const DEFAULT_OFFERS = [
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
    featured: true,
    status: "active" as const,
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
    featured: true,
    status: "active" as const,
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
    featured: false,
    status: "active" as const,
    adminName: "Abrar Chowdhury"
  }
];

const DEFAULT_MODERATORS = [
  {
    id: "mod-1",
    name: "Abrar Chowdhury",
    phone: "01712345678",
    email: "admin@admin.com",
    nid: "1994261234567",
    role: "admin" as const,
    status: "active" as const
  },
  {
    id: "mod-2",
    name: "Nafis Kamal",
    phone: "01812345679",
    email: "nafis@foodreview.com",
    nid: "1997261234568",
    role: "moderator" as const,
    status: "active" as const
  }
];

const DEFAULT_SETTINGS = {
  desktopLogo: "",
  mobileLogo: "",
  footerDesktopLogo: "",
  footerMobileLogo: "",
  siteName: "Food Review Bangladesh",
  description: "A premium restaurant reviews and discount offers platform in Bangladesh."
};

// Seed function to initialize Firestore collections
export async function seedDatabase() {
  try {
    // Check and seed banners
    const bannersSnap = await getDocs(collection(db, 'banners'));
    if (bannersSnap.empty) {
      console.log("Seeding banners...");
      for (const banner of DEFAULT_BANNERS) {
        await setDoc(doc(db, 'banners', banner.id), banner);
      }
    }

    // Check and seed categories
    const categoriesSnap = await getDocs(collection(db, 'categories'));
    if (categoriesSnap.empty) {
      console.log("Seeding categories...");
      for (const cat of DEFAULT_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }

    // Check and seed reviews
    const reviewsSnap = await getDocs(collection(db, 'reviews'));
    if (reviewsSnap.empty) {
      console.log("Seeding reviews...");
      for (const review of DEFAULT_REVIEWS) {
        await setDoc(doc(db, 'reviews', review.id), review);
      }
    }

    // Check and seed offers
    const offersSnap = await getDocs(collection(db, 'offers'));
    if (offersSnap.empty) {
      console.log("Seeding offers...");
      for (const offer of DEFAULT_OFFERS) {
        await setDoc(doc(db, 'offers', offer.id), offer);
      }
    }

    // Check and seed moderators
    const modsSnap = await getDocs(collection(db, 'moderators'));
    if (modsSnap.empty) {
      console.log("Seeding moderators...");
      for (const mod of DEFAULT_MODERATORS) {
        await setDoc(doc(db, 'moderators', mod.id), mod);
      }
    }

    // Seed settings if missing
    const settingsDoc = await getDoc(doc(db, 'settings', 'app'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'settings', 'app'), DEFAULT_SETTINGS);
    }

    console.log("Database successfully seeded/verified!");
  } catch (error) {
    console.error("Error seeding database, falling back to mock layers:", error);
  }
}
