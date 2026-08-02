import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  BarChart3, 
  Image, 
  Users, 
  Award, 
  Tag, 
  FolderOpen, 
  Settings as SettingsIcon,
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Sun, 
  Moon, 
  TrendingUp, 
  Eye, 
  Heart,
  UploadCloud,
  ChevronRight,
  Info
} from 'lucide-react';
import { Review, Offer, Moderator, Category, Banner, AppSettings } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    reviews, 
    offers, 
    categories, 
    banners, 
    settings, 
    moderators, 
    currentUser, 
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
    saveSettings
  } = useApp();

  const navigate = useNavigate();

  // Route protection - if not logged in, force to login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // UI state
  const [activeTab, setActiveTab] = useState<'summary' | 'logo' | 'banners' | 'moderators' | 'reviews' | 'offers' | 'categories'>('summary');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Forms editing state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // LOGO MANAGEMENT STATES
  const [desktopLogoInput, setDesktopLogoInput] = useState(settings.desktopLogo || '');
  const [mobileLogoInput, setMobileLogoInput] = useState(settings.mobileLogo || '');
  const [logoSaveSuccess, setLogoSaveSuccess] = useState(false);

  // REVIEW FORM STATE
  const [reviewForm, setReviewForm] = useState({
    restaurantName: '',
    foodCategory: '',
    rating: 5,
    thumbnail: '',
    thumbnailClickLink: '',
    description: '',
    shortDescription: '',
    location: '',
    videoUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
    tags: '',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    draft: false
  });

  // OFFER FORM STATE
  const [offerForm, setOfferForm] = useState({
    restaurantName: '',
    thumbnail: '',
    caption: '',
    couponCode: '',
    shortDescription: '',
    discountPercentage: 15,
    expiryDate: '',
    category: '',
    featured: false,
    status: 'active' as const
  });

  // MODERATOR FORM STATE
  const [moderatorForm, setModeratorForm] = useState({
    name: '',
    phone: '',
    email: '',
    nid: '',
    password: '',
    confirmPassword: '',
    role: 'moderator' as const,
    status: 'active' as const
  });

  // CATEGORY FORM STATE
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    type: 'food' as const
  });

  // BANNER FORM STATE
  const [bannerForm, setBannerForm] = useState({
    imageUrl: '',
    linkUrl: '',
    title: '',
    order: 1
  });

  // STATS CALCULATIONS
  const totalReviews = reviews.length;
  const totalOffers = offers.length;
  const totalViews = reviews.reduce((acc, r) => acc + (r.views || 0), 0);
  const totalLikes = reviews.reduce((acc, r) => acc + (r.likes || 0), 0);
  const totalCategories = categories.length;
  const totalModerators = moderators.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Drag and Drop Logo Simulation
  const handleLogoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings({
      desktopLogo: desktopLogoInput,
      mobileLogo: mobileLogoInput
    });
    setLogoSaveSuccess(true);
    setTimeout(() => setLogoSaveSuccess(false), 2000);
  };

  // Form submit handlers
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTags = reviewForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    const reviewData = {
      restaurantName: reviewForm.restaurantName,
      foodCategory: reviewForm.foodCategory || categories.find(c => c.type === 'food')?.name || 'Best Biriyani',
      rating: Number(reviewForm.rating),
      thumbnail: reviewForm.thumbnail || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&fit=crop',
      thumbnailClickLink: reviewForm.thumbnailClickLink,
      description: reviewForm.description,
      shortDescription: reviewForm.shortDescription,
      location: reviewForm.location,
      videoUrl: reviewForm.videoUrl,
      facebookUrl: reviewForm.facebookUrl,
      youtubeUrl: reviewForm.youtubeUrl,
      tags: cleanTags,
      featured: reviewForm.featured,
      publishDate: new Date().toISOString(),
      seoTitle: reviewForm.seoTitle,
      seoDescription: reviewForm.seoDescription,
      adminName: currentUser?.name || 'Administrator'
    };

    if (editingItem) {
      await updateReview({
        ...editingItem,
        ...reviewData
      });
    } else {
      await addReview(reviewData);
    }
    resetForms();
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const offerData = {
      restaurantName: offerForm.restaurantName,
      thumbnail: offerForm.thumbnail || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&fit=crop',
      caption: offerForm.caption,
      couponCode: offerForm.couponCode,
      shortDescription: offerForm.shortDescription,
      discountPercentage: Number(offerForm.discountPercentage),
      expiryDate: offerForm.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: offerForm.category || categories.find(c => c.type === 'food')?.name || 'Best Biriyani',
      featured: offerForm.featured,
      status: offerForm.status,
      adminName: currentUser?.name || 'Administrator'
    };

    if (editingItem) {
      await updateOffer({
        ...editingItem,
        ...offerData
      });
    } else {
      await addOffer(offerData);
    }
    resetForms();
  };

  const handleModeratorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (moderatorForm.password !== moderatorForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const modData = {
      name: moderatorForm.name,
      phone: moderatorForm.phone,
      email: moderatorForm.email,
      nid: moderatorForm.nid,
      password: moderatorForm.password,
      role: moderatorForm.role,
      status: moderatorForm.status
    };

    if (editingItem) {
      await updateModerator({
        ...editingItem,
        ...modData
      });
    } else {
      await addModerator(modData);
    }
    resetForms();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCategory(categoryForm.name, categoryForm.type);
    resetForms();
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bData = {
      imageUrl: bannerForm.imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1600&h=900&fit=crop',
      linkUrl: bannerForm.linkUrl,
      title: bannerForm.title,
      order: Number(bannerForm.order)
    };

    if (editingItem) {
      await updateBanner({
        ...editingItem,
        ...bData
      });
    } else {
      await addBanner(bData);
    }
    resetForms();
  };

  const resetForms = () => {
    setEditingItem(null);
    setShowForm(false);
    
    // Reset inputs
    setReviewForm({
      restaurantName: '',
      foodCategory: '',
      rating: 5,
      thumbnail: '',
      thumbnailClickLink: '',
      description: '',
      shortDescription: '',
      location: '',
      videoUrl: '',
      facebookUrl: '',
      youtubeUrl: '',
      tags: '',
      featured: false,
      seoTitle: '',
      seoDescription: '',
      draft: false
    });

    setOfferForm({
      restaurantName: '',
      thumbnail: '',
      caption: '',
      couponCode: '',
      shortDescription: '',
      discountPercentage: 15,
      expiryDate: '',
      category: '',
      featured: false,
      status: 'active'
    });

    setModeratorForm({
      name: '',
      phone: '',
      email: '',
      nid: '',
      password: '',
      confirmPassword: '',
      role: 'moderator',
      status: 'active'
    });

    setCategoryForm({
      name: '',
      type: 'food'
    });

    setBannerForm({
      imageUrl: '',
      linkUrl: '',
      title: '',
      order: 1
    });
  };

  const handleEditClick = (item: any, type: string) => {
    setEditingItem(item);
    setShowForm(true);

    if (type === 'review') {
      setReviewForm({
        restaurantName: item.restaurantName,
        foodCategory: item.foodCategory,
        rating: item.rating,
        thumbnail: item.thumbnail,
        thumbnailClickLink: item.thumbnailClickLink || '',
        description: item.description,
        shortDescription: item.shortDescription,
        location: item.location,
        videoUrl: item.videoUrl || '',
        facebookUrl: item.facebookUrl || '',
        youtubeUrl: item.youtubeUrl || '',
        tags: item.tags.join(', '),
        featured: item.featured,
        seoTitle: item.seoTitle || '',
        seoDescription: item.seoDescription || '',
        draft: false
      });
    } else if (type === 'offer') {
      setOfferForm({
        restaurantName: item.restaurantName,
        thumbnail: item.thumbnail,
        caption: item.caption,
        couponCode: item.couponCode,
        shortDescription: item.shortDescription,
        discountPercentage: item.discountPercentage,
        expiryDate: item.expiryDate,
        category: item.category,
        featured: item.featured,
        status: item.status
      });
    } else if (type === 'moderator') {
      setModeratorForm({
        name: item.name,
        phone: item.phone,
        email: item.email,
        nid: item.nid,
        password: item.password || '',
        confirmPassword: item.password || '',
        role: item.role,
        status: item.status
      });
    } else if (type === 'banner') {
      setBannerForm({
        imageUrl: item.imageUrl,
        linkUrl: item.linkUrl,
        title: item.title,
        order: item.order
      });
    }
  };

  if (!currentUser) {
    return null; // Route protection handles redirect
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-neutral-50 text-neutral-800'}`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`w-64 shrink-0 border-r ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} hidden md:flex flex-col justify-between p-6`}>
        <div className="space-y-8">
          
          {/* Logo Brand info */}
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-white">
              S
            </span>
            <div>
              <span className="text-sm font-black tracking-tight uppercase">
                Staff Dashboard
              </span>
              <div className="text-[10px] text-neutral-400 capitalize font-medium">{currentUser.role} Control</div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('summary'); resetForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'summary' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <BarChart3 size={16} />
              Summary Statistics
            </button>

            <button
              onClick={() => { setActiveTab('logo'); resetForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'logo' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <SettingsIcon size={16} />
              Logo Manager
            </button>

            <button
              onClick={() => { setActiveTab('banners'); resetForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'banners' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <Image size={16} />
              Banners
            </button>

            <button
              onClick={() => { setActiveTab('reviews'); resetForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'reviews' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <Award size={16} />
              Reviews
            </button>

            <button
              onClick={() => { setActiveTab('offers'); resetForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'offers' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <Tag size={16} />
              Coupons & Offers
            </button>

            <button
              onClick={() => { setActiveTab('categories'); resetForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'categories' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <FolderOpen size={16} />
              Categories
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => { setActiveTab('moderators'); resetForms(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeTab === 'moderators' 
                    ? 'bg-red-600 text-white' 
                    : 'text-neutral-500 hover:text-red-600'
                }`}
              >
                <Users size={16} />
                Moderators
              </button>
            )}
          </nav>
        </div>

        {/* User Block info */}
        <div className={`pt-6 border-t ${darkMode ? 'border-zinc-800' : 'border-neutral-100'} space-y-4`}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              {currentUser.name[0]}
            </div>
            <div>
              <div className="text-xs font-bold">{currentUser.name}</div>
              <div className="text-[10px] text-neutral-400 capitalize">{currentUser.role} Status</div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl text-xs font-bold uppercase text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out Staff
          </button>
        </div>
      </aside>

      {/* CORE VIEWPORT CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12">
        
        {/* Top Header Controls bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-100">
          <div>
            <h1 className="text-3xl font-black tracking-tight font-sans">
              Control Panel Dashboard
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Administer Food Review Bangladesh collections securely
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggler */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border cursor-pointer ${
                darkMode ? 'bg-zinc-800 border-zinc-700 text-yellow-400' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-xs font-bold uppercase border border-neutral-200 rounded-xl bg-white text-neutral-700 hover:bg-neutral-50 shadow-sm"
            >
              Visit Public Site
            </button>
          </div>
        </div>

        {/* SECTION 1: SUMMARY STATISTICS */}
        {activeTab === 'summary' && (
          <div className="space-y-10">
            {/* Grid stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
                <div className="text-neutral-400 text-xs font-bold uppercase">Total Reviews</div>
                <div className="text-3xl font-black mt-2 text-red-600">{totalReviews}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
                <div className="text-neutral-400 text-xs font-bold uppercase">Total Offers</div>
                <div className="text-3xl font-black mt-2 text-yellow-500">{totalOffers}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
                <div className="text-neutral-400 text-xs font-bold uppercase">Total Views</div>
                <div className="text-3xl font-black mt-2 text-blue-600">{totalViews}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
                <div className="text-neutral-400 text-xs font-bold uppercase">Total Likes</div>
                <div className="text-3xl font-black mt-2 text-green-600">{totalLikes}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
                <div className="text-neutral-400 text-xs font-bold uppercase">Categories</div>
                <div className="text-3xl font-black mt-2">{totalCategories}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
                <div className="text-neutral-400 text-xs font-bold uppercase">Moderators</div>
                <div className="text-3xl font-black mt-2">{totalModerators}</div>
              </div>

            </div>

            {/* Performance charts block using elegant clean SVG vectors */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-red-600" />
                  <h3 className="text-lg font-black uppercase tracking-tight">Cuisine Ratings Distribution</h3>
                </div>
                <span className="text-xs font-bold text-neutral-400 bg-neutral-100 dark:bg-zinc-800 px-2.5 py-1 rounded">Live Data metrics</span>
              </div>

              {/* Graphical rating bars */}
              <div className="space-y-4">
                {reviews.slice(0, 5).map((rev) => (
                  <div key={rev.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
                      <span>{rev.restaurantName} ({rev.foodCategory})</span>
                      <span className="text-neutral-700 dark:text-neutral-200">Rating: {rev.rating.toFixed(1)} ★</span>
                    </div>
                    <div className="h-3 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 rounded-full" 
                        style={{ width: `${(rev.rating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Stream block */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
              <h3 className="text-base font-black mb-4 uppercase tracking-wider">Recent Platform Activity Log</h3>
              <div className="divide-y divide-neutral-100/10 text-xs space-y-3.5">
                <div className="pt-3.5 flex items-center justify-between">
                  <span className="text-neutral-500">Kacchi Biriyani review from Sultan's Dine loaded</span>
                  <span className="font-semibold text-green-600">3,240 Views</span>
                </div>
                <div className="pt-3.5 flex items-center justify-between">
                  <span className="text-neutral-500">Chillox Double Patty Burger review saved by moderator</span>
                  <span className="font-semibold text-neutral-400">July 30, 2026</span>
                </div>
                <div className="pt-3.5 flex items-center justify-between">
                  <span className="text-neutral-500">Coupon Code <code className="bg-neutral-100 dark:bg-zinc-800 px-1 font-bold">KACCHI15</code> initialized in database</span>
                  <span className="font-semibold text-yellow-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: LOGO MANAGEMENT */}
        {activeTab === 'logo' && (
          <div className="space-y-8 max-w-2xl">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm space-y-6`}>
              <h3 className="text-lg font-black uppercase tracking-tight">Platform Logo Configuration</h3>
              
              {logoSaveSuccess && (
                <div className="p-3 bg-green-500 text-white text-xs font-bold rounded-xl text-center">
                  Logo settings updated successfully!
                </div>
              )}

              <form onSubmit={handleLogoSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Desktop Site Logo (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-... or leave empty for default font logo"
                    value={desktopLogoInput}
                    onChange={(e) => setDesktopLogoInput(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                  />
                  <div className="mt-3 p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-100 dark:border-zinc-800 text-[11px] text-neutral-400 flex items-center gap-1.5">
                    <Info size={14} className="shrink-0 text-red-500" />
                    <span>Provide direct cover image links to replace the default brand logos across the header.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Mobile Site Logo (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-... or leave empty for default"
                    value={mobileLogoInput}
                    onChange={(e) => setMobileLogoInput(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md shadow-red-200 dark:shadow-none"
                  >
                    Save Logo Configurations
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDesktopLogoInput('');
                      setMobileLogoInput('');
                    }}
                    className="px-6 py-3 border border-neutral-200 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-800 transition"
                  >
                    Reset to Default
                  </button>
                </div>
              </form>

              {/* Visual Logo Preview Area */}
              <div className="pt-6 border-t border-neutral-100/10">
                <div className="text-xs font-bold text-neutral-400 uppercase mb-3">Live Brand Preview</div>
                <div className="flex items-center gap-6 p-4 bg-neutral-50 dark:bg-zinc-800 rounded-2xl border border-neutral-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <div className="text-[10px] text-neutral-400 uppercase">Desktop Preview:</div>
                    <div className="font-extrabold text-neutral-800 dark:text-white flex items-center gap-1">
                      {desktopLogoInput ? <img src={desktopLogoInput} className="h-6 object-contain" alt="Logo preview" referrerPolicy="no-referrer" /> : 'FoodReviewBD'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-neutral-400 uppercase">Mobile Preview:</div>
                    <div className="font-extrabold text-neutral-800 dark:text-white flex items-center gap-1">
                      {mobileLogoInput ? <img src={mobileLogoInput} className="h-5 object-contain" alt="Logo preview" referrerPolicy="no-referrer" /> : 'F'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: BANNER MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Banner Slide Deck Banners</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-xs font-black uppercase rounded-xl hover:bg-red-700 transition"
                >
                  <Plus size={16} /> Add Slide Banner
                </button>
              )}
            </div>

            {showForm && (
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-md max-w-2xl`}>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100/10">
                  <h3 className="font-black uppercase text-sm">{editingItem ? 'Edit Banner Slide' : 'Upload New Banner (Required 1600x900)'}</h3>
                  <button onClick={resetForms} className="text-neutral-400 hover:text-red-500"><XCircle size={18} /></button>
                </div>

                <form onSubmit={handleBannerSubmit} className="space-y-4">
                  {/* Drag and drop banner visual area */}
                  <div className="border-2 border-dashed border-neutral-300 dark:border-zinc-700 rounded-2xl p-6 text-center space-y-2 hover:border-red-500 transition">
                    <UploadCloud className="mx-auto text-neutral-400" size={32} />
                    <p className="text-xs font-bold">Drag and Drop Banner Cover Here or Provide URL Below</p>
                    <p className="text-[10px] text-neutral-400">Optimal size 1600 x 900 High Resolution (JPEG/WebP)</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Banner Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={bannerForm.imageUrl}
                      onChange={(e) => setBannerForm.setImageUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Slide Title / Slogan</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sultan's Dine Legendary Mutton Kacchi"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm.setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Slide Redirect URL</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/... or Facebook link"
                        value={bannerForm.linkUrl}
                        onChange={(e) => setBannerForm.setLinkUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Display Order (Order index)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={bannerForm.order}
                      onChange={(e) => setBannerForm.setOrder(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl">
                      {editingItem ? 'Save Slide changes' : 'Publish Banner'}
                    </button>
                    <button type="button" onClick={resetForms} className="px-6 py-2.5 border border-neutral-200 dark:border-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List grid of banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {banners.map((b) => (
                <div key={b.id} className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
                  <img src={b.imageUrl} className="w-full aspect-[16/9] object-cover" alt="banner preview" referrerPolicy="no-referrer" />
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] text-red-600 font-black uppercase">Slide Order {b.order}</div>
                    <h4 className="font-extrabold text-sm line-clamp-1">{b.title}</h4>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleEditClick(b, 'banner')}
                        className="text-xs font-bold uppercase text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Delete banner?')) {
                            await deleteBanner(b.id);
                          }
                        }}
                        className="text-xs font-bold uppercase text-red-600 flex items-center gap-1 hover:underline ml-4"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: REVIEWS MANAGEMENT */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Reviews Base ({reviews.length})</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-xs font-black uppercase rounded-xl hover:bg-red-700 transition"
                >
                  <Plus size={16} /> Publish Food Review
                </button>
              )}
            </div>

            {showForm && (
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-md`}>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100/10">
                  <h3 className="font-black uppercase text-sm">{editingItem ? 'Modify Review Form' : 'Publish New Restaurant Review'}</h3>
                  <button onClick={resetForms} className="text-neutral-400 hover:text-red-500"><XCircle size={18} /></button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Sultan's Dine"
                        value={reviewForm.restaurantName}
                        onChange={(e) => setReviewForm({ ...reviewForm, restaurantName: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Food Category</label>
                      <select
                        value={reviewForm.foodCategory}
                        onChange={(e) => setReviewForm({ ...reviewForm, foodCategory: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      >
                        {categories.filter(c => c.type === 'food').map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Thumbnail (Image URL)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={reviewForm.thumbnail}
                        onChange={(e) => setReviewForm({ ...reviewForm, thumbnail: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Thumbnail Click Direct Link (Video / Facebook / YouTube URL)</label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/watch/?v=..."
                        value={reviewForm.thumbnailClickLink}
                        onChange={(e) => setReviewForm({ ...reviewForm, thumbnailClickLink: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Rating Star score (1-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        required
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Restaurant Location</label>
                      <input
                        type="text"
                        required
                        placeholder="Dhanmondi, Dhaka"
                        value={reviewForm.location}
                        onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Kacchi, Mutton, Dhanmondi"
                        value={reviewForm.tags}
                        onChange={(e) => setReviewForm({ ...reviewForm, tags: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Video Broadcast URL</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?..."
                        value={reviewForm.videoUrl}
                        onChange={(e) => setReviewForm({ ...reviewForm, videoUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Facebook Post URL</label>
                      <input
                        type="url"
                        value={reviewForm.facebookUrl}
                        onChange={(e) => setReviewForm({ ...reviewForm, facebookUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">YouTube Video URL</label>
                      <input
                        type="url"
                        value={reviewForm.youtubeUrl}
                        onChange={(e) => setReviewForm({ ...reviewForm, youtubeUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      placeholder="Sultan's Dine Dhanmondi Review - Food Review BD"
                      value={reviewForm.seoTitle}
                      onChange={(e) => setReviewForm({ ...reviewForm, seoTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">SEO Meta Description</label>
                    <textarea
                      placeholder="An in depth breakdown rating mutton, rice, service and price details..."
                      value={reviewForm.seoDescription}
                      onChange={(e) => setReviewForm({ ...reviewForm, seoDescription: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm h-16"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Short Description Hook</label>
                    <input
                      type="text"
                      required
                      placeholder="The absolute gold standard mutton biriyani in Dhaka with robust flavors."
                      value={reviewForm.shortDescription}
                      onChange={(e) => setReviewForm({ ...reviewForm, shortDescription: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Detailed Culinary Description (HTML Supported)</label>
                    <textarea
                      required
                      placeholder="<p>Sultan's Dine sets standard...</p>"
                      value={reviewForm.description}
                      onChange={(e) => setReviewForm({ ...reviewForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm h-36 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="revFeatured"
                      checked={reviewForm.featured}
                      onChange={(e) => setReviewForm({ ...reviewForm, featured: e.target.checked })}
                      className="h-4 w-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                    />
                    <label htmlFor="revFeatured" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Feature this Review in Carousel</label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl">
                      {editingItem ? 'Save review updates' : 'Publish Review'}
                    </button>
                    <button type="button" onClick={resetForms} className="px-6 py-2.5 border border-neutral-200 dark:border-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews Table list */}
            <div className={`overflow-x-auto rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold text-neutral-400 ${darkMode ? 'border-zinc-800' : 'border-neutral-100'}`}>
                    <th className="p-4">Restaurant</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Stats</th>
                    <th className="p-4">Admin</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-neutral-100 dark:divide-zinc-800">
                  {reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/50">
                      <td className="p-4 font-bold flex items-center gap-2">
                        <img src={r.thumbnail} className="h-8 w-8 rounded object-cover shrink-0" alt="review cover" referrerPolicy="no-referrer" />
                        <span>{r.restaurantName}</span>
                      </td>
                      <td className="p-4">{r.foodCategory}</td>
                      <td className="p-4 font-extrabold text-yellow-500">{r.rating.toFixed(1)} ★</td>
                      <td className="p-4 text-neutral-500 flex items-center gap-3 h-16">
                        <span className="flex items-center gap-1"><Eye size={12} /> {r.views || 0}</span>
                        <span className="flex items-center gap-1"><Heart size={12} /> {r.likes || 0}</span>
                      </td>
                      <td className="p-4 font-semibold">{r.adminName}</td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => handleEditClick(r, 'review')} className="text-blue-600 hover:underline font-bold">Edit</button>
                        <button onClick={async () => {
                          if (confirm(`Delete review for ${r.restaurantName}?`)) {
                            await deleteReview(r.id);
                          }
                        }} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 5: OFFERS/COUPONS MANAGEMENT */}
        {activeTab === 'offers' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Active Coupons Offers</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-xs font-black uppercase rounded-xl hover:bg-red-700 transition"
                >
                  <Plus size={16} /> Publish Coupon Offer
                </button>
              )}
            </div>

            {showForm && (
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-md`}>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100/10">
                  <h3 className="font-black uppercase text-sm">{editingItem ? 'Edit Offer Info' : 'Create New Discount Coupon'}</h3>
                  <button onClick={resetForms} className="text-neutral-400 hover:text-red-500"><XCircle size={18} /></button>
                </div>

                <form onSubmit={handleOfferSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Chillox"
                        value={offerForm.restaurantName}
                        onChange={(e) => setOfferForm({ ...offerForm, restaurantName: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Category</label>
                      <select
                        value={offerForm.category}
                        onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      >
                        {categories.filter(c => c.type === 'food').map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Offer Thumbnail (Image URL)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={offerForm.thumbnail}
                        onChange={(e) => setOfferForm({ ...offerForm, thumbnail: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Coupon code</label>
                      <input
                        type="text"
                        required
                        placeholder="CHILLBOGO"
                        value={offerForm.couponCode}
                        onChange={(e) => setOfferForm({ ...offerForm, couponCode: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Discount percentage (%)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="100"
                        value={offerForm.discountPercentage}
                        onChange={(e) => setOfferForm({ ...offerForm, discountPercentage: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Expiry Date</label>
                      <input
                        type="date"
                        required
                        value={offerForm.expiryDate}
                        onChange={(e) => setOfferForm({ ...offerForm, expiryDate: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Offer Status</label>
                      <select
                        value={offerForm.status}
                        onChange={(e) => setOfferForm({ ...offerForm, status: e.target.value as any })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Offer Caption / Tagline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Get Flat 15% Off on Kacchi Platters!"
                      value={offerForm.caption}
                      onChange={(e) => setOfferForm({ ...offerForm, caption: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Short Offer Description</label>
                    <textarea
                      required
                      placeholder="Enjoy 15% discount on our mutton platter, valid only on weekdays at any Dhanmondi branch..."
                      value={offerForm.shortDescription}
                      onChange={(e) => setOfferForm({ ...offerForm, shortDescription: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm h-24"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="offFeatured"
                      checked={offerForm.featured}
                      onChange={(e) => setOfferForm({ ...offerForm, featured: e.target.checked })}
                      className="h-4 w-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                    />
                    <label htmlFor="offFeatured" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Mark as Featured Coupon</label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl">
                      {editingItem ? 'Save Coupon changes' : 'Create Coupon'}
                    </button>
                    <button type="button" onClick={resetForms} className="px-6 py-2.5 border border-neutral-200 dark:border-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Coupon table list */}
            <div className={`overflow-x-auto rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold text-neutral-400 ${darkMode ? 'border-zinc-800' : 'border-neutral-100'}`}>
                    <th className="p-4">Restaurant</th>
                    <th className="p-4">Caption Slogan</th>
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Expiry</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-neutral-100 dark:divide-zinc-800">
                  {offers.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/50">
                      <td className="p-4 font-bold flex items-center gap-2">
                        <img src={o.thumbnail} className="h-8 w-8 rounded object-cover shrink-0" alt="offer thumbnail" referrerPolicy="no-referrer" />
                        <span>{o.restaurantName}</span>
                      </td>
                      <td className="p-4 truncate max-w-[200px]">{o.caption}</td>
                      <td className="p-4"><code className="bg-neutral-100 dark:bg-zinc-800 px-2 py-1 rounded font-bold text-red-600">{o.couponCode}</code></td>
                      <td className="p-4 font-black">{o.discountPercentage}% OFF</td>
                      <td className="p-4">{o.expiryDate}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                          o.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => handleEditClick(o, 'offer')} className="text-blue-600 hover:underline font-bold">Edit</button>
                        <button onClick={async () => {
                          if (confirm(`Delete offer coupon for ${o.restaurantName}?`)) {
                            await deleteOffer(o.id);
                          }
                        }} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 6: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-8 max-w-2xl">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm space-y-6`}>
              <h3 className="text-lg font-black uppercase tracking-tight">Create Cuisine Category</h3>
              
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Category Title Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seafood, Street Food, Burger"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Classification Type</label>
                  <select
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                  >
                    <option value="food">Food Cuisine Category</option>
                    <option value="restaurant">Restaurant Category</option>
                  </select>
                </div>

                <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl">
                  Add Category Record
                </button>
              </form>
            </div>

            {/* List Table of categories */}
            <div className={`overflow-x-auto rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold text-neutral-400 ${darkMode ? 'border-zinc-800' : 'border-neutral-100'}`}>
                    <th className="p-4">Name ID</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-neutral-100 dark:divide-zinc-800">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/50">
                      <td className="p-4 font-bold">{c.name}</td>
                      <td className="p-4 uppercase text-[10px] tracking-wider font-semibold text-neutral-500">{c.type}</td>
                      <td className="p-4 text-right">
                        <button onClick={async () => {
                          if (confirm(`Delete category "${c.name}"?`)) {
                            await deleteCategory(c.id);
                          }
                        }} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 7: MODERATOR MANAGEMENT (ADMIN ONLY) */}
        {activeTab === 'moderators' && currentUser.role === 'admin' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">System Moderators</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-xs font-black uppercase rounded-xl hover:bg-red-700 transition"
                >
                  <Plus size={16} /> Register Staff Moderator
                </button>
              )}
            </div>

            {showForm && (
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-md max-w-2xl`}>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100/10">
                  <h3 className="font-black uppercase text-sm">{editingItem ? 'Edit Moderator Account' : 'Register New Staff Moderator'}</h3>
                  <button onClick={resetForms} className="text-neutral-400 hover:text-red-500"><XCircle size={18} /></button>
                </div>

                <form onSubmit={handleModeratorSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Nafis Kamal"
                        value={moderatorForm.name}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="01712-345678"
                        value={moderatorForm.phone}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="nafis@foodreview.com"
                        value={moderatorForm.email}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, email: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">NID (National Identity Number)</label>
                      <input
                        type="text"
                        required
                        placeholder="1995261234567"
                        value={moderatorForm.nid}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, nid: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Password</label>
                      <input
                        type="password"
                        required={!editingItem}
                        placeholder="••••••••"
                        value={moderatorForm.password}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, password: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required={!editingItem}
                        placeholder="••••••••"
                        value={moderatorForm.confirmPassword}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Role Designation</label>
                      <select
                        value={moderatorForm.role}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, role: e.target.value as any })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      >
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Status</label>
                      <select
                        value={moderatorForm.status}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, status: e.target.value as any })}
                        className="w-full px-4 py-2 border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 rounded-xl text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl">
                      {editingItem ? 'Save Staff profile' : 'Register Moderator'}
                    </button>
                    <button type="button" onClick={resetForms} className="px-6 py-2.5 border border-neutral-200 dark:border-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List Table of moderators */}
            <div className={`overflow-x-auto rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold text-neutral-400 ${darkMode ? 'border-zinc-800' : 'border-neutral-100'}`}>
                    <th className="p-4">Name</th>
                    <th className="p-4">NID / Email / Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-neutral-100 dark:divide-zinc-800">
                  {moderators.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/50">
                      <td className="p-4 font-bold">{m.name}</td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div>NID: {m.nid}</div>
                          <div className="text-neutral-500">Email: {m.email}</div>
                          <div className="text-neutral-400">Phone: {m.phone}</div>
                        </div>
                      </td>
                      <td className="p-4 uppercase tracking-wider font-extrabold text-[10px]">{m.role}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          m.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : m.status === 'suspended'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => handleEditClick(m, 'moderator')} className="text-blue-600 hover:underline font-bold">Edit</button>
                        <button onClick={async () => {
                          if (confirm(`Remove moderator account for ${m.name}?`)) {
                            await deleteModerator(m.id);
                          }
                        }} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
