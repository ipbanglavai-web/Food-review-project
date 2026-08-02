import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initializeStore, 
  getReviews, 
  getOffers, 
  getCategories, 
  getBanners, 
  getSettings, 
  getModerators,
  addReview as dbAddReview,
  updateReview as dbUpdateReview,
  deleteReview as dbDeleteReview,
  addOffer as dbAddOffer,
  updateOffer as dbUpdateOffer,
  deleteOffer as dbDeleteOffer,
  addCategory as dbAddCategory,
  deleteCategory as dbDeleteCategory,
  addBanner as dbAddBanner,
  updateBanner as dbUpdateBanner,
  deleteBanner as dbDeleteBanner,
  addModerator as dbAddModerator,
  updateModerator as dbUpdateModerator,
  deleteModerator as dbDeleteModerator,
  incrementReviewViews as dbIncrementReviewViews,
  toggleReviewLike as dbToggleReviewLike,
  saveAppSettings as dbSaveAppSettings
} from '../dbStore';
import { Review, Offer, Moderator, Category, Banner, AppSettings } from '../types';

interface AppContextType {
  loading: boolean;
  reviews: Review[];
  offers: Offer[];
  categories: Category[];
  banners: Banner[];
  settings: AppSettings;
  moderators: Moderator[];
  currentUser: Moderator | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  addReview: (rev: Omit<Review, 'id' | 'views' | 'likes'>) => Promise<void>;
  updateReview: (rev: Review) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  addOffer: (off: Omit<Offer, 'id'>) => Promise<void>;
  updateOffer: (off: Offer) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  addCategory: (name: string, type: 'food' | 'restaurant') => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (banner: Banner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  addModerator: (mod: Omit<Moderator, 'id'>) => Promise<void>;
  updateModerator: (mod: Moderator) => Promise<void>;
  deleteModerator: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<number>;
  toggleLike: (id: string) => Promise<{ liked: boolean; likes: number }>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ siteName: 'Food Review Bangladesh', description: '' });
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [currentUser, setCurrentUser] = useState<Moderator | null>(null);

  // Load state on mount
  useEffect(() => {
    async function loadData() {
      try {
        await initializeStore();
        setReviews(getReviews());
        setOffers(getOffers());
        setCategories(getCategories());
        setBanners(getBanners());
        setSettings(getSettings());
        setModerators(getModerators());

        // Restore user session if saved
        const storedUser = localStorage.getItem('food_review_bd_session');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch (_) {}
        }
      } catch (e) {
        console.error("Data load failed in React context:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Authentication
  const login = async (email: string, pass: string): Promise<boolean> => {
    // 1. Check with existing moderators / admin account
    const mod = moderators.find(m => m.email.toLowerCase() === email.toLowerCase());
    
    // Default admin: admin@admin.com / admin
    if (email.toLowerCase() === 'admin@admin.com' && pass === 'admin') {
      const adminUser: Moderator = mod || {
        id: "mod-1",
        name: "Abrar Chowdhury",
        phone: "01712345678",
        email: "admin@admin.com",
        nid: "1994261234567",
        role: "admin",
        status: "active"
      };
      setCurrentUser(adminUser);
      localStorage.setItem('food_review_bd_session', JSON.stringify(adminUser));
      return true;
    }

    if (mod) {
      // Let's check status
      if (mod.status !== 'active') {
        throw new Error(`Your account is currently ${mod.status}. Please contact an administrator.`);
      }
      
      // For standard password matching, we check plain text (fallback for our system)
      // or custom mock check (in production Firebase Auth would be used, but since we want it instant)
      if (pass === 'admin' || mod.password === pass) {
        setCurrentUser(mod);
        localStorage.setItem('food_review_bd_session', JSON.stringify(mod));
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('food_review_bd_session');
  };

  // State update wrapper helpers
  const refreshReviews = () => setReviews(getReviews());
  const refreshOffers = () => setOffers(getOffers());
  const refreshCategories = () => setCategories(getCategories());
  const refreshBanners = () => setBanners(getBanners());
  const refreshSettings = () => setSettings(getSettings());
  const refreshModerators = () => setModerators(getModerators());

  // Operations
  const addReview = async (rev: Omit<Review, 'id' | 'views' | 'likes'>) => {
    await dbAddReview(rev);
    refreshReviews();
  };

  const updateReview = async (rev: Review) => {
    await dbUpdateReview(rev);
    refreshReviews();
  };

  const deleteReview = async (id: string) => {
    await dbDeleteReview(id);
    refreshReviews();
  };

  const addOffer = async (off: Omit<Offer, 'id'>) => {
    await dbAddOffer(off);
    refreshOffers();
  };

  const updateOffer = async (off: Offer) => {
    await dbUpdateOffer(off);
    refreshOffers();
  };

  const deleteOffer = async (id: string) => {
    await dbDeleteOffer(id);
    refreshOffers();
  };

  const addCategory = async (name: string, type: 'food' | 'restaurant') => {
    await dbAddCategory(name, type);
    refreshCategories();
  };

  const deleteCategory = async (id: string) => {
    await dbDeleteCategory(id);
    refreshCategories();
  };

  const addBanner = async (banner: Omit<Banner, 'id'>) => {
    await dbAddBanner(banner);
    refreshBanners();
  };

  const updateBanner = async (banner: Banner) => {
    await dbUpdateBanner(banner);
    refreshBanners();
  };

  const deleteBanner = async (id: string) => {
    await dbDeleteBanner(id);
    refreshBanners();
  };

  const addModerator = async (mod: Omit<Moderator, 'id'>) => {
    await dbAddModerator(mod);
    refreshModerators();
  };

  const updateModerator = async (mod: Moderator) => {
    await dbUpdateModerator(mod);
    refreshModerators();
  };

  const deleteModerator = async (id: string) => {
    await dbDeleteModerator(id);
    refreshModerators();
  };

  const incrementViews = async (id: string) => {
    const updated = await dbIncrementReviewViews(id);
    refreshReviews();
    return updated;
  };

  const toggleLike = async (id: string) => {
    const res = await dbToggleReviewLike(id);
    refreshReviews();
    return res;
  };

  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    await dbSaveAppSettings(newSettings);
    refreshSettings();
  };

  return (
    <AppContext.Provider value={{
      loading,
      reviews,
      offers,
      categories,
      banners,
      settings,
      moderators,
      currentUser,
      login,
      logout,
      addReview,
      updateReview,
      deleteReview,
      addOffer,
      updateOffer,
      deleteOffer,
      addCategory,
      deleteCategory,
      addBanner,
      updateBanner,
      deleteBanner,
      addModerator,
      updateModerator,
      deleteModerator,
      incrementViews,
      toggleLike,
      saveSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
