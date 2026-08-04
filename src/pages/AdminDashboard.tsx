import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Info,
  Mail,
  Phone,
  MessageSquare,
  Inbox,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Send,
  X
} from 'lucide-react';
import { Review, Offer, Moderator, Category, Banner, AppSettings, ContactMessage } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    reviews, 
    offers, 
    categories, 
    banners, 
    settings, 
    moderators, 
    messages,
    currentUser, 
    logout,
    addReview,
    approveReview,
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
    markMessageRead,
    deleteMessage,
    saveSettings
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Route protection - if not logged in, force to login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // UI state
  const [activeTab, setActiveTab] = useState<'summary' | 'logo' | 'contact' | 'banners' | 'moderators' | 'reviews' | 'pending_reviews' | 'offers' | 'categories' | 'messages'>(() => {
    if (location.state?.activeTab) {
      return location.state.activeTab;
    }
    return 'summary';
  });

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');

  // Message filtering & modal state
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageSearch, setMessageSearch] = useState<string>('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'review' | 'offer' | 'category' | 'banner' | 'moderator' | 'message';
    id: string;
    name: string;
  } | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsSubmitting(true);
      if (deleteTarget.type === 'review') {
        await deleteReview(deleteTarget.id);
      } else if (deleteTarget.type === 'offer') {
        await deleteOffer(deleteTarget.id);
      } else if (deleteTarget.type === 'category') {
        await deleteCategory(deleteTarget.id);
      } else if (deleteTarget.type === 'banner') {
        await deleteBanner(deleteTarget.id);
      } else if (deleteTarget.type === 'moderator') {
        await deleteModerator(deleteTarget.id);
      } else if (deleteTarget.type === 'message') {
        await deleteMessage(deleteTarget.id);
        if (selectedMessage?.id === deleteTarget.id) {
          setSelectedMessage(null);
        }
      }
      setActionStatus({ type: 'success', message: `Deleted "${deleteTarget.name}" successfully.` });
      setTimeout(() => setActionStatus(null), 3000);
    } catch (err: any) {
      console.error("Delete failed:", err);
      setActionStatus({ type: 'error', message: 'Failed to delete item. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setDeleteTarget(null);
    }
  };

  // Forms editing state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // LOGO MANAGEMENT STATES
  const [desktopLogoInput, setDesktopLogoInput] = useState(settings.desktopLogo || '');
  const [mobileLogoInput, setMobileLogoInput] = useState(settings.mobileLogo || '');
  const [logoSaveSuccess, setLogoSaveSuccess] = useState(false);

  // CONTACT & ABOUT US MANAGEMENT STATE
  const [contactForm, setContactForm] = useState({
    contactAddress: settings.contactAddress || 'Road 11, Banani Commercial Area, Dhaka - 1213, Bangladesh',
    contactEmail: settings.contactEmail || 'support@foodreviewbd.com',
    contactPhone: settings.contactPhone || '+880 1712-345678',
    description: settings.description || 'The premier platform for authentic food reviews, trusted culinary suggestions, and exclusive restaurant discounts across Bangladesh.',
    facebookUrl: settings.facebookUrl || 'https://facebook.com',
    youtubeUrl: settings.youtubeUrl || 'https://youtube.com',
    instagramUrl: settings.instagramUrl || 'https://instagram.com',
    twitterUrl: settings.twitterUrl || 'https://twitter.com',

    // About Us Page fields
    aboutEyebrow: settings.aboutEyebrow || 'Who We Are',
    aboutTitle: settings.aboutTitle || 'About Food Review Bangladesh',
    aboutDescription: settings.aboutDescription || 'We are Bangladesh\'s premier, independent culinary community. Our staff and moderators travel across the country to bring you unbiased reviews, high-definition videos, and exclusive discount coupons.',
    aboutCard1Title: settings.aboutCard1Title || 'Unbiased Ratings',
    aboutCard1Desc: settings.aboutCard1Desc || 'We pay for our meals. Our reviews represent honest assessments of quality, price, and cleanliness.',
    aboutCard2Title: settings.aboutCard2Title || 'Trusted Coupons',
    aboutCard2Desc: settings.aboutCard2Desc || 'We coordinate directly with restaurant managements to offer real, working discount codes.',
    aboutCard3Title: settings.aboutCard3Title || 'Local Cuisines',
    aboutCard3Desc: settings.aboutCard3Desc || 'From Old Dhaka\'s traditional Kacchi Biriyani to Banani\'s gourmet burgers, we cover everything.',
    aboutStoryTitle: settings.aboutStoryTitle || 'Our Culinary Journey',
    aboutStoryParagraph1: settings.aboutStoryParagraph1 || 'Food Review Bangladesh started as a small group of passionate food critics in Dhaka. Realizing there was no single resource compiling both detailed text write-ups, video walkthroughs, and verified discount coupons in a beautiful visual interface, we built this premium restaurant platform.',
    aboutStoryParagraph2: settings.aboutStoryParagraph2 || 'Today, our platform has verified over 150 restaurants, saved users hundreds of thousands of BDT in discount coupon redemptions, and expanded to represent cities beyond Dhaka, including Chittagong, Sylhet, and Rajshahi.'
  });

  useEffect(() => {
    if (settings) {
      setDesktopLogoInput(settings.desktopLogo || '');
      setMobileLogoInput(settings.mobileLogo || '');
      setContactForm({
        contactAddress: settings.contactAddress || 'Road 11, Banani Commercial Area, Dhaka - 1213, Bangladesh',
        contactEmail: settings.contactEmail || 'support@foodreviewbd.com',
        contactPhone: settings.contactPhone || '+880 1712-345678',
        description: settings.description || 'The premier platform for authentic food reviews, trusted culinary suggestions, and exclusive restaurant discounts across Bangladesh.',
        facebookUrl: settings.facebookUrl || 'https://facebook.com',
        youtubeUrl: settings.youtubeUrl || 'https://youtube.com',
        instagramUrl: settings.instagramUrl || 'https://instagram.com',
        twitterUrl: settings.twitterUrl || 'https://twitter.com',

        aboutEyebrow: settings.aboutEyebrow || 'Who We Are',
        aboutTitle: settings.aboutTitle || 'About Food Review Bangladesh',
        aboutDescription: settings.aboutDescription || 'We are Bangladesh\'s premier, independent culinary community. Our staff and moderators travel across the country to bring you unbiased reviews, high-definition videos, and exclusive discount coupons.',
        aboutCard1Title: settings.aboutCard1Title || 'Unbiased Ratings',
        aboutCard1Desc: settings.aboutCard1Desc || 'We pay for our meals. Our reviews represent honest assessments of quality, price, and cleanliness.',
        aboutCard2Title: settings.aboutCard2Title || 'Trusted Coupons',
        aboutCard2Desc: settings.aboutCard2Desc || 'We coordinate directly with restaurant managements to offer real, working discount codes.',
        aboutCard3Title: settings.aboutCard3Title || 'Local Cuisines',
        aboutCard3Desc: settings.aboutCard3Desc || 'From Old Dhaka\'s traditional Kacchi Biriyani to Banani\'s gourmet burgers, we cover everything.',
        aboutStoryTitle: settings.aboutStoryTitle || 'Our Culinary Journey',
        aboutStoryParagraph1: settings.aboutStoryParagraph1 || 'Food Review Bangladesh started as a small group of passionate food critics in Dhaka. Realizing there was no single resource compiling both detailed text write-ups, video walkthroughs, and verified discount coupons in a beautiful visual interface, we built this premium restaurant platform.',
        aboutStoryParagraph2: settings.aboutStoryParagraph2 || 'Today, our platform has verified over 150 restaurants, saved users hundreds of thousands of BDT in discount coupon redemptions, and expanded to represent cities beyond Dhaka, including Chittagong, Sylhet, and Rajshahi.'
      });
    }
  }, [settings]);

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
    subtitle: '',
    description: '',
    order: 1
  });

  // STATS CALCULATIONS
  const totalReviews = reviews.length;
  const totalOffers = offers.length;
  const totalPosts = reviews.length + offers.length;
  const totalViews = reviews.reduce((acc, r) => acc + (r.views || 0), 0);
  const totalLikes = reviews.reduce((acc, r) => acc + (r.likes || 0), 0);
  const totalCategories = categories.length;
  const totalModerators = moderators.length;
  const totalMessages = messages.length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Drag and Drop Logo Simulation
  const handleLogoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await saveSettings({
        desktopLogo: desktopLogoInput,
        mobileLogo: mobileLogoInput
      });
      setLogoSaveSuccess(true);
      setActionStatus({ type: 'success', message: 'Logo settings saved to Firestore successfully!' });
      setTimeout(() => {
        setLogoSaveSuccess(false);
        setActionStatus(null);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: 'Failed to save logo settings to Firestore.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await saveSettings({
        contactAddress: contactForm.contactAddress,
        contactEmail: contactForm.contactEmail,
        contactPhone: contactForm.contactPhone,
        description: contactForm.description,
        facebookUrl: contactForm.facebookUrl,
        youtubeUrl: contactForm.youtubeUrl,
        instagramUrl: contactForm.instagramUrl,
        twitterUrl: contactForm.twitterUrl,

        aboutEyebrow: contactForm.aboutEyebrow,
        aboutTitle: contactForm.aboutTitle,
        aboutDescription: contactForm.aboutDescription,
        aboutCard1Title: contactForm.aboutCard1Title,
        aboutCard1Desc: contactForm.aboutCard1Desc,
        aboutCard2Title: contactForm.aboutCard2Title,
        aboutCard2Desc: contactForm.aboutCard2Desc,
        aboutCard3Title: contactForm.aboutCard3Title,
        aboutCard3Desc: contactForm.aboutCard3Desc,
        aboutStoryTitle: contactForm.aboutStoryTitle,
        aboutStoryParagraph1: contactForm.aboutStoryParagraph1,
        aboutStoryParagraph2: contactForm.aboutStoryParagraph2
      });
      setActionStatus({ type: 'success', message: 'About Us page & Contact details saved to Firestore successfully!' });
      setTimeout(() => {
        setActionStatus(null);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: 'Failed to save settings to Firestore.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form submit handlers
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const cleanTags = reviewForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const isModerator = currentUser?.role === 'moderator';
      const initialStatus: 'approved' | 'pending' = isModerator ? 'pending' : 'approved';

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
        adminName: currentUser?.name || 'Administrator',
        status: editingItem ? (editingItem.status || 'approved') : initialStatus
      };

      if (editingItem) {
        await updateReview({
          ...editingItem,
          ...reviewData
        });
        setActionStatus({ type: 'success', message: 'Review updated in Firestore successfully!' });
      } else {
        await addReview(reviewData);
        if (isModerator) {
          setActionStatus({ type: 'success', message: 'Review submitted successfully! It is now pending admin approval before going public.' });
        } else {
          setActionStatus({ type: 'success', message: 'New review published to Firestore successfully!' });
        }
      }
      setTimeout(() => setActionStatus(null), 4000);
      resetForms();
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: 'Failed to save review to Firestore. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReview = async (id: string) => {
    try {
      setIsSubmitting(true);
      await approveReview(id);
      setActionStatus({ type: 'success', message: 'Review approved and published publicly!' });
      setTimeout(() => setActionStatus(null), 3500);
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: 'Failed to approve review.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
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
        setActionStatus({ type: 'success', message: 'Offer updated in Firestore successfully!' });
      } else {
        await addOffer(offerData);
        setActionStatus({ type: 'success', message: 'New coupon offer published to Firestore successfully!' });
      }
      setTimeout(() => setActionStatus(null), 3500);
      resetForms();
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: 'Failed to save coupon offer to Firestore.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeratorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (moderatorForm.password !== moderatorForm.confirmPassword) {
      setActionStatus({ type: 'error', message: 'Passwords do not match!' });
      return;
    }

    try {
      setIsSubmitting(true);
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
        setActionStatus({ type: 'success', message: 'Moderator profile updated in Firestore successfully!' });
      } else {
        await addModerator(modData);
        setActionStatus({ type: 'success', message: 'New moderator registered to Firestore successfully!' });
      }
      setTimeout(() => setActionStatus(null), 3500);
      resetForms();
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: 'Failed to save moderator data to Firestore.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await addCategory(categoryForm.name, categoryForm.type);
      setActionStatus({ type: 'success', message: 'Category added to Firestore successfully!' });
      setTimeout(() => setActionStatus(null), 3500);
      resetForms();
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: 'Failed to add category to Firestore.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const bData = {
        imageUrl: bannerForm.imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1600&h=900&fit=crop',
        linkUrl: bannerForm.linkUrl,
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        description: bannerForm.description,
        order: Number(bannerForm.order)
      };

      if (editingItem) {
        await updateBanner({
          ...editingItem,
          ...bData
        });
        setActionStatus({ type: 'success', message: 'Banner slide updated in Firestore successfully!' });
      } else {
        await addBanner(bData);
        setActionStatus({ type: 'success', message: 'Banner slide added to Firestore successfully!' });
      }
      setTimeout(() => setActionStatus(null), 3500);
      resetForms();
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: 'Failed to save banner slide to Firestore.' });
    } finally {
      setIsSubmitting(false);
    }
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
      subtitle: '',
      description: '',
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
        subtitle: item.subtitle || '',
        description: item.description || '',
        order: item.order
      });
    }
  };

  if (!currentUser) {
    return null; // Route protection handles redirect
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-neutral-50 text-neutral-800'}`}>
      
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
              onClick={() => { setActiveTab('contact'); resetForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'contact' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <Info size={16} />
              About Us & Contact
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
              onClick={() => { setActiveTab('pending_reviews'); resetForms(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'pending_reviews' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock size={16} />
                <span>Pending Reviews</span>
              </div>
              {reviews.filter(r => r.status === 'pending').length > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                  activeTab === 'pending_reviews' ? 'bg-white text-red-600' : 'bg-amber-500 text-black'
                }`}>
                  {reviews.filter(r => r.status === 'pending').length}
                </span>
              )}
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

            <button
              onClick={() => { setActiveTab('messages'); resetForms(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'messages' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-500 hover:text-red-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={16} />
                <span>Messages</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                  activeTab === 'messages' ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                }`}>
                  {unreadMessagesCount}
                </span>
              )}
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

        {/* Global Action Status Alert Banner */}
        {actionStatus && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center justify-between border ${
            actionStatus.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
          }`}>
            <span>{actionStatus.message}</span>
            <button onClick={() => setActionStatus(null)} className="text-xs uppercase underline cursor-pointer ml-4">
              Dismiss
            </button>
          </div>
        )}

        {/* SECTION 1: SUMMARY STATISTICS */}
        {activeTab === 'summary' && (
          <div className="space-y-10">
            {/* Grid stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
              
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm`}>
                <div className={`text-xs font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Total Reviews</div>
                <div className="text-3xl font-black mt-2 text-red-600">{totalReviews}</div>
              </div>

              <div
                onClick={() => setActiveTab('pending_reviews')}
                className={`p-5 rounded-2xl border ${
                  darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-amber-500' : 'bg-white border-neutral-200 text-black hover:border-amber-400'
                } shadow-sm cursor-pointer transition`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-xs font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Pending Reviews</div>
                  {reviews.filter(r => r.status === 'pending').length > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black bg-amber-500 text-black rounded-full">
                      {reviews.filter(r => r.status === 'pending').length} New
                    </span>
                  )}
                </div>
                <div className="text-3xl font-black mt-2 text-amber-500">{reviews.filter(r => r.status === 'pending').length}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm`}>
                <div className={`text-xs font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Total Offers</div>
                <div className="text-3xl font-black mt-2 text-yellow-500">{totalOffers}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm`}>
                <div className={`text-xs font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Total Views</div>
                <div className="text-3xl font-black mt-2 text-blue-600">{totalViews}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm`}>
                <div className={`text-xs font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Total Posts</div>
                <div className="text-3xl font-black mt-2 text-green-600">{totalPosts}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm`}>
                <div className={`text-xs font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Categories</div>
                <div className={`text-3xl font-black mt-2 ${darkMode ? 'text-zinc-100' : 'text-black'}`}>{totalCategories}</div>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm`}>
                <div className={`text-xs font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Moderators</div>
                <div className={`text-3xl font-black mt-2 ${darkMode ? 'text-zinc-100' : 'text-black'}`}>{totalModerators}</div>
              </div>

              <div
                onClick={() => setActiveTab('messages')}
                className={`p-5 rounded-2xl border ${
                  darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-red-500' : 'bg-white border-neutral-200 text-black hover:border-red-400'
                } shadow-sm cursor-pointer transition`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-xs font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>User Messages</div>
                  {unreadMessagesCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black bg-red-600 text-white rounded-full">
                      {unreadMessagesCount} New
                    </span>
                  )}
                </div>
                <div className="text-3xl font-black mt-2 text-purple-600">{totalMessages}</div>
              </div>

            </div>

            {/* Performance charts block using elegant clean SVG vectors */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm`}>
              <div className={`flex items-center justify-between mb-6 pb-4 border-b ${darkMode ? 'border-zinc-800' : 'border-neutral-200'}`}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-red-600" />
                  <h3 className={`text-lg font-black uppercase tracking-tight ${darkMode ? 'text-zinc-100' : 'text-black'}`}>Cuisine Ratings Distribution</h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded ${darkMode ? 'text-zinc-300 bg-zinc-800' : 'text-black bg-neutral-100'}`}>Live Data metrics</span>
              </div>

              {/* Graphical rating bars */}
              <div className="space-y-4">
                {reviews.slice(0, 5).map((rev) => (
                  <div key={rev.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={darkMode ? 'text-zinc-300' : 'text-neutral-800'}>{rev.restaurantName} ({rev.foodCategory})</span>
                      <span className={darkMode ? 'text-zinc-100' : 'text-black'}>Rating: {rev.rating.toFixed(1)} ★</span>
                    </div>
                    <div className={`h-3 w-full rounded-full overflow-hidden ${darkMode ? 'bg-zinc-800' : 'bg-neutral-100'}`}>
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
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm`}>
              <h3 className={`text-base font-black mb-4 uppercase tracking-wider ${darkMode ? 'text-zinc-100' : 'text-black'}`}>Recent Platform Activity Log</h3>
              <div className={`divide-y text-xs space-y-3.5 ${darkMode ? 'divide-zinc-800' : 'divide-neutral-200'}`}>
                <div className="pt-3.5 flex items-center justify-between">
                  <span className={darkMode ? 'text-zinc-300' : 'text-black'}>Kacchi Biriyani review from Sultan's Dine loaded</span>
                  <span className="font-semibold text-green-600">3,240 Views</span>
                </div>
                <div className="pt-3.5 flex items-center justify-between">
                  <span className={darkMode ? 'text-zinc-300' : 'text-black'}>Chillox Double Patty Burger review saved by moderator</span>
                  <span className={`font-semibold ${darkMode ? 'text-zinc-400' : 'text-neutral-700'}`}>July 30, 2026</span>
                </div>
                <div className="pt-3.5 flex items-center justify-between">
                  <span className={darkMode ? 'text-zinc-300' : 'text-black'}>Coupon Code <code className={`px-1 font-bold rounded ${darkMode ? 'bg-zinc-800 text-zinc-200' : 'bg-neutral-100 text-black'}`}>KACCHI15</code> initialized in database</span>
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
                  <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Desktop Site Logo (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-... or leave empty for default font logo"
                    value={desktopLogoInput}
                    onChange={(e) => setDesktopLogoInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                  />
                  <div className="mt-3 p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-200/60 dark:border-zinc-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <Info size={14} className="shrink-0 text-red-500" />
                    <span>Provide direct cover image links to replace the default brand logos across the header.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Mobile Site Logo (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-... or leave empty for default"
                    value={mobileLogoInput}
                    onChange={(e) => setMobileLogoInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
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

        {/* SECTION: CONTACT & ABOUT US MANAGEMENT */}
        {activeTab === 'contact' && (
          <div className="space-y-6 max-w-4xl">
            <div className={`p-6 sm:p-8 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm space-y-6`}>
              <div className={`flex items-center justify-between pb-4 border-b ${darkMode ? 'border-zinc-800' : 'border-neutral-100'}`}>
                <div>
                  <h2 className={`text-xl font-black font-sans ${darkMode ? 'text-zinc-100' : 'text-neutral-900'}`}>About Us Page & Contact Details</h2>
                  <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-neutral-500'} mt-1`}>Manage all "About Us" page text sections, vision cards, office location, helpline, email, and social links.</p>
                </div>
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${darkMode ? 'bg-red-950/40 text-red-500' : 'bg-red-50 text-red-600'}`}>
                  <Info size={20} />
                </div>
              </div>

              <form onSubmit={handleContactSave} className="space-y-8">
                {/* SUBSECTION 1: ABOUT US PAGE CONTENT */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/40 dark:border-zinc-800">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-zinc-300' : 'text-neutral-700'}`}>
                      1. About Us Hero Header
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Category Eyebrow Text
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.aboutEyebrow}
                        onChange={(e) => setContactForm({ ...contactForm, aboutEyebrow: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Main Heading Title
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.aboutTitle}
                        onChange={(e) => setContactForm({ ...contactForm, aboutTitle: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                      Hero Description / Subtitle
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={contactForm.aboutDescription}
                      onChange={(e) => setContactForm({ ...contactForm, aboutDescription: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                        darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                      }`}
                    />
                  </div>
                </div>

                {/* SUBSECTION 2: ABOUT US FEATURE CARDS */}
                <div className="space-y-5 pt-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/40 dark:border-zinc-800">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-zinc-300' : 'text-neutral-700'}`}>
                      2. Vision & Values Cards
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1 */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-neutral-50 border-neutral-200/60'}`}>
                      <span className="text-[10px] font-extrabold uppercase text-red-600">Card 1</span>
                      <div>
                        <label className={`block text-[10px] font-extrabold uppercase mb-1 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Title</label>
                        <input
                          type="text"
                          required
                          value={contactForm.aboutCard1Title}
                          onChange={(e) => setContactForm({ ...contactForm, aboutCard1Title: e.target.value })}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs ${darkMode ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-extrabold uppercase mb-1 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Description</label>
                        <textarea
                          required
                          rows={3}
                          value={contactForm.aboutCard1Desc}
                          onChange={(e) => setContactForm({ ...contactForm, aboutCard1Desc: e.target.value })}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs ${darkMode ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'}`}
                        />
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-neutral-50 border-neutral-200/60'}`}>
                      <span className="text-[10px] font-extrabold uppercase text-red-600">Card 2</span>
                      <div>
                        <label className={`block text-[10px] font-extrabold uppercase mb-1 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Title</label>
                        <input
                          type="text"
                          required
                          value={contactForm.aboutCard2Title}
                          onChange={(e) => setContactForm({ ...contactForm, aboutCard2Title: e.target.value })}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs ${darkMode ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-extrabold uppercase mb-1 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Description</label>
                        <textarea
                          required
                          rows={3}
                          value={contactForm.aboutCard2Desc}
                          onChange={(e) => setContactForm({ ...contactForm, aboutCard2Desc: e.target.value })}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs ${darkMode ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'}`}
                        />
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-neutral-50 border-neutral-200/60'}`}>
                      <span className="text-[10px] font-extrabold uppercase text-red-600">Card 3</span>
                      <div>
                        <label className={`block text-[10px] font-extrabold uppercase mb-1 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Title</label>
                        <input
                          type="text"
                          required
                          value={contactForm.aboutCard3Title}
                          onChange={(e) => setContactForm({ ...contactForm, aboutCard3Title: e.target.value })}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs ${darkMode ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-extrabold uppercase mb-1 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Description</label>
                        <textarea
                          required
                          rows={3}
                          value={contactForm.aboutCard3Desc}
                          onChange={(e) => setContactForm({ ...contactForm, aboutCard3Desc: e.target.value })}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs ${darkMode ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUBSECTION 3: CULINARY JOURNEY / STORY BLOCK */}
                <div className="space-y-5 pt-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/40 dark:border-zinc-800">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-zinc-300' : 'text-neutral-700'}`}>
                      3. Our Story Section
                    </h3>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                      Story Heading Title
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.aboutStoryTitle}
                      onChange={(e) => setContactForm({ ...contactForm, aboutStoryTitle: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                        darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Story Paragraph 1
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.aboutStoryParagraph1}
                        onChange={(e) => setContactForm({ ...contactForm, aboutStoryParagraph1: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Story Paragraph 2
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.aboutStoryParagraph2}
                        onChange={(e) => setContactForm({ ...contactForm, aboutStoryParagraph2: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* SUBSECTION 4: CONTACT & FOOTER INFO */}
                <div className="space-y-5 pt-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/40 dark:border-zinc-800">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-zinc-300' : 'text-neutral-700'}`}>
                      4. Office Location, Helpline & Footer Bio
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Office / Headquarters Address
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.contactAddress}
                        onChange={(e) => setContactForm({ ...contactForm, contactAddress: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Support Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.contactEmail}
                        onChange={(e) => setContactForm({ ...contactForm, contactEmail: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Official Helpline / Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.contactPhone}
                        onChange={(e) => setContactForm({ ...contactForm, contactPhone: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Facebook Page URL
                      </label>
                      <input
                        type="url"
                        value={contactForm.facebookUrl}
                        onChange={(e) => setContactForm({ ...contactForm, facebookUrl: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        YouTube Channel URL
                      </label>
                      <input
                        type="url"
                        value={contactForm.youtubeUrl}
                        onChange={(e) => setContactForm({ ...contactForm, youtubeUrl: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Instagram Page URL
                      </label>
                      <input
                        type="url"
                        value={contactForm.instagramUrl}
                        onChange={(e) => setContactForm({ ...contactForm, instagramUrl: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                        Twitter / X Handle URL
                      </label>
                      <input
                        type="url"
                        value={contactForm.twitterUrl}
                        onChange={(e) => setContactForm({ ...contactForm, twitterUrl: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                          darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
                      Footer About / Platform Bio
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={contactForm.description}
                      onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs ${
                        darkMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'bg-white text-neutral-900 border border-neutral-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-neutral-100/10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md shadow-red-200 dark:shadow-none"
                  >
                    {isSubmitting ? 'Saving Settings...' : 'Save All Details'}
                  </button>
                </div>
              </form>
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
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Banner Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={bannerForm.imageUrl}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Slide Title / Slogan</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sultan's Dine Legendary Mutton Kacchi"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Slide Redirect URL</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/... or Facebook link"
                        value={bannerForm.linkUrl}
                        onChange={(e) => setBannerForm((prev) => ({ ...prev, linkUrl: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Subtitle / Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Authentic Old Dhaka Style Mutton Kacchi with Borhani"
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Banner Description / Info Paragraph</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Experience the rich aroma of long-grain Basmati rice and melt-in-the-mouth mutton cooked to perfection."
                      value={bannerForm.description}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Display Order (Order index)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={bannerForm.order}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
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
                    {b.subtitle && <p className="text-xs font-semibold text-amber-500 line-clamp-1">{b.subtitle}</p>}
                    {b.description && <p className="text-xs text-neutral-400 line-clamp-2">{b.description}</p>}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleEditClick(b, 'banner')}
                        className="text-xs font-bold uppercase text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'banner', id: b.id, name: b.title })}
                        className="text-xs font-bold uppercase text-red-600 flex items-center gap-1 hover:underline ml-4 cursor-pointer"
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
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Sultan's Dine"
                        value={reviewForm.restaurantName}
                        onChange={(e) => setReviewForm({ ...reviewForm, restaurantName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Food Category</label>
                      <select
                        value={reviewForm.foodCategory}
                        onChange={(e) => setReviewForm({ ...reviewForm, foodCategory: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      >
                        {categories.filter(c => c.type === 'food').map(c => (
                          <option key={c.id} value={c.name} className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Thumbnail (Image URL)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={reviewForm.thumbnail}
                        onChange={(e) => setReviewForm({ ...reviewForm, thumbnail: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Thumbnail Click Direct Link (Video / Facebook / YouTube URL)</label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/watch/?v=..."
                        value={reviewForm.thumbnailClickLink}
                        onChange={(e) => setReviewForm({ ...reviewForm, thumbnailClickLink: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Rating Star score (1-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        required
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Restaurant Location</label>
                      <input
                        type="text"
                        required
                        placeholder="Dhanmondi, Dhaka"
                        value={reviewForm.location}
                        onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Kacchi, Mutton, Dhanmondi"
                        value={reviewForm.tags}
                        onChange={(e) => setReviewForm({ ...reviewForm, tags: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Video Broadcast URL</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?..."
                        value={reviewForm.videoUrl}
                        onChange={(e) => setReviewForm({ ...reviewForm, videoUrl: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Facebook Post URL</label>
                      <input
                        type="url"
                        value={reviewForm.facebookUrl}
                        onChange={(e) => setReviewForm({ ...reviewForm, facebookUrl: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">YouTube Video URL</label>
                      <input
                        type="url"
                        value={reviewForm.youtubeUrl}
                        onChange={(e) => setReviewForm({ ...reviewForm, youtubeUrl: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      placeholder="Sultan's Dine Dhanmondi Review - Food Review BD"
                      value={reviewForm.seoTitle}
                      onChange={(e) => setReviewForm({ ...reviewForm, seoTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">SEO Meta Description</label>
                    <textarea
                      placeholder="An in depth breakdown rating mutton, rice, service and price details..."
                      value={reviewForm.seoDescription}
                      onChange={(e) => setReviewForm({ ...reviewForm, seoDescription: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs h-16"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Short Description Hook</label>
                    <input
                      type="text"
                      required
                      placeholder="The absolute gold standard mutton biriyani in Dhaka with robust flavors."
                      value={reviewForm.shortDescription}
                      onChange={(e) => setReviewForm({ ...reviewForm, shortDescription: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Detailed Culinary Description (HTML Supported)</label>
                    <textarea
                      required
                      placeholder="<p>Sultan's Dine sets standard...</p>"
                      value={reviewForm.description}
                      onChange={(e) => setReviewForm({ ...reviewForm, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs h-36 font-mono"
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

            {/* Reviews filter tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-zinc-800 pb-3">
              <button
                onClick={() => setReviewStatusFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                  reviewStatusFilter === 'all'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-neutral-100 text-neutral-800 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-neutral-200/60 dark:hover:bg-zinc-700'
                }`}
              >
                All ({reviews.length})
              </button>
              <button
                onClick={() => setReviewStatusFilter('approved')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                  reviewStatusFilter === 'approved'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-neutral-100 text-neutral-800 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-neutral-200/60 dark:hover:bg-zinc-700'
                }`}
              >
                Approved ({reviews.filter(r => !r.status || r.status === 'approved').length})
              </button>
              <button
                onClick={() => setReviewStatusFilter('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  reviewStatusFilter === 'pending'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-neutral-100 text-neutral-800 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-neutral-200/60 dark:hover:bg-zinc-700'
                }`}
              >
                <span>Pending</span>
                {reviews.filter(r => r.status === 'pending').length > 0 && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                    reviewStatusFilter === 'pending' ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                  }`}>
                    {reviews.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>

            {/* Reviews Table list */}
            <div className={`overflow-x-auto rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold text-neutral-400 ${darkMode ? 'border-zinc-800' : 'border-neutral-100'}`}>
                    <th className="p-4">Restaurant</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Stats</th>
                    <th className="p-4">Submitted By</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-neutral-100 dark:divide-zinc-800">
                  {reviews
                    .filter(r => {
                      if (reviewStatusFilter === 'approved') return !r.status || r.status === 'approved';
                      if (reviewStatusFilter === 'pending') return r.status === 'pending';
                      return true;
                    })
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-neutral-50/50 dark:hover:bg-zinc-800/30">
                        <td className="p-4 font-bold flex items-center gap-2">
                          <img src={r.thumbnail} className="h-8 w-8 rounded object-cover shrink-0" alt="review cover" referrerPolicy="no-referrer" />
                          <div>
                            <span className="block">{r.restaurantName}</span>
                            <span className="text-[10px] font-normal text-neutral-400 line-clamp-1">{r.shortDescription}</span>
                          </div>
                        </td>
                        <td className="p-4">{r.foodCategory}</td>
                        <td className="p-4 font-extrabold text-yellow-500">{r.rating.toFixed(1)} ★</td>
                        <td className="p-4">
                          {r.status === 'pending' ? (
                            <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 flex items-center w-max gap-1">
                              <Clock size={10} /> Pending Approval
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 flex items-center w-max gap-1">
                              <CheckCircle2 size={10} /> Approved
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-neutral-500 flex items-center gap-3 h-16">
                          <span className="flex items-center gap-1"><Eye size={12} /> {r.views || 0}</span>
                          <span className="flex items-center gap-1"><Heart size={12} /> {r.likes || 0}</span>
                        </td>
                        <td className="p-4 font-semibold">{r.adminName}</td>
                        <td className="p-4 text-right space-x-2">
                          {r.status === 'pending' && currentUser?.role === 'admin' && (
                            <button
                              onClick={() => handleApproveReview(r.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 size={12} /> Approve
                            </button>
                          )}
                          <button onClick={() => handleEditClick(r, 'review')} className="text-blue-600 hover:underline font-bold">Edit</button>
                          <button onClick={() => setDeleteTarget({ type: 'review', id: r.id, name: `${r.restaurantName} Review` })} className="text-red-600 hover:underline font-bold cursor-pointer">Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 4.5: PENDING REVIEWS MANAGEMENT */}
        {activeTab === 'pending_reviews' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="text-amber-500" size={24} />
                  <span>Pending Reviews Awaiting Approval</span>
                  <span className="px-2.5 py-0.5 text-xs font-black bg-amber-500 text-black rounded-full">
                    {reviews.filter(r => r.status === 'pending').length}
                  </span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Reviews submitted by moderators are kept in pending status until approved by an admin.
                </p>
              </div>
            </div>

            {reviews.filter(r => r.status === 'pending').length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm space-y-3`}>
                <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-bold text-base">No Pending Reviews</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  All moderator submissions have been reviewed and approved. New pending submissions will appear here.
                </p>
              </div>
            ) : (
              <div className={`overflow-x-auto rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'} shadow-sm`}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-[10px] uppercase font-bold text-neutral-400 ${darkMode ? 'border-zinc-800' : 'border-neutral-100'}`}>
                      <th className="p-4">Restaurant</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Submitted By</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-neutral-100 dark:divide-zinc-800">
                    {reviews.filter(r => r.status === 'pending').map((r) => (
                      <tr key={r.id} className="hover:bg-neutral-50/50 dark:hover:bg-zinc-800/30">
                        <td className="p-4 font-bold flex items-center gap-3">
                          <img src={r.thumbnail} className="h-10 w-10 rounded-xl object-cover shrink-0" alt="review cover" referrerPolicy="no-referrer" />
                          <div>
                            <span className="block text-sm font-black">{r.restaurantName}</span>
                            <span className="text-xs text-neutral-400 font-normal line-clamp-1">{r.shortDescription}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold">{r.foodCategory}</td>
                        <td className="p-4 font-extrabold text-yellow-500">{r.rating.toFixed(1)} ★</td>
                        <td className="p-4 font-semibold">{r.adminName}</td>
                        <td className="p-4 text-neutral-400">
                          {new Date(r.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleApproveReview(r.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                          >
                            <CheckCircle2 size={14} /> Approve & Publish
                          </button>
                          <button
                            onClick={() => {
                              handleEditClick(r, 'review');
                              setActiveTab('reviews');
                            }}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'review', id: r.id, name: `${r.restaurantName} Review (Pending)` })}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition"
                          >
                            <Trash2 size={14} /> Reject / Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Chillox"
                        value={offerForm.restaurantName}
                        onChange={(e) => setOfferForm({ ...offerForm, restaurantName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={offerForm.category}
                        onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      >
                        {categories.filter(c => c.type === 'food').map(c => (
                          <option key={c.id} value={c.name} className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Offer Thumbnail (Image URL)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={offerForm.thumbnail}
                        onChange={(e) => setOfferForm({ ...offerForm, thumbnail: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Coupon code</label>
                      <input
                        type="text"
                        required
                        placeholder="CHILLBOGO"
                        value={offerForm.couponCode}
                        onChange={(e) => setOfferForm({ ...offerForm, couponCode: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Discount percentage (%)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="100"
                        value={offerForm.discountPercentage}
                        onChange={(e) => setOfferForm({ ...offerForm, discountPercentage: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Expiry Date</label>
                      <input
                        type="date"
                        required
                        value={offerForm.expiryDate}
                        onChange={(e) => setOfferForm({ ...offerForm, expiryDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Offer Status</label>
                      <select
                        value={offerForm.status}
                        onChange={(e) => setOfferForm({ ...offerForm, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      >
                        <option value="active" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Active</option>
                        <option value="inactive" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Offer Caption / Tagline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Get Flat 15% Off on Kacchi Platters!"
                      value={offerForm.caption}
                      onChange={(e) => setOfferForm({ ...offerForm, caption: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Short Offer Description</label>
                    <textarea
                      required
                      placeholder="Enjoy 15% discount on our mutton platter, valid only on weekdays at any Dhanmondi branch..."
                      value={offerForm.shortDescription}
                      onChange={(e) => setOfferForm({ ...offerForm, shortDescription: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs h-24"
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
                        <button onClick={() => setDeleteTarget({ type: 'offer', id: o.id, name: `${o.restaurantName} Coupon (${o.couponCode})` })} className="text-red-600 hover:underline font-bold cursor-pointer">Delete</button>
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
                  <label className="block text-xs font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Category Title Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seafood, Street Food, Burger"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Classification Type</label>
                  <select
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                  >
                    <option value="food" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Food Cuisine Category</option>
                    <option value="restaurant" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Restaurant Category</option>
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
                        <button onClick={() => setDeleteTarget({ type: 'category', id: c.id, name: c.name })} className="text-red-600 hover:underline font-bold cursor-pointer">Delete</button>
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
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Nafis Kamal"
                        value={moderatorForm.name}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="01712-345678"
                        value={moderatorForm.phone}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="nafis@foodreview.com"
                        value={moderatorForm.email}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">NID (National Identity Number)</label>
                      <input
                        type="text"
                        required
                        placeholder="1995261234567"
                        value={moderatorForm.nid}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, nid: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Password</label>
                      <input
                        type="password"
                        required={!editingItem}
                        placeholder="••••••••"
                        value={moderatorForm.password}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, password: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required={!editingItem}
                        placeholder="••••••••"
                        value={moderatorForm.confirmPassword}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Role Designation</label>
                      <select
                        value={moderatorForm.role}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, role: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      >
                        <option value="moderator" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Moderator</option>
                        <option value="admin" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Status</label>
                      <select
                        value={moderatorForm.status}
                        onChange={(e) => setModeratorForm({ ...moderatorForm, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-2xs"
                      >
                        <option value="active" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Active</option>
                        <option value="suspended" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Suspended</option>
                        <option value="banned" className="bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100">Banned</option>
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
                        <button onClick={() => setDeleteTarget({ type: 'moderator', id: m.id, name: `${m.name} (${m.role})` })} className="text-red-600 hover:underline font-bold cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 9: USER MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-neutral-200 text-black'} shadow-sm space-y-6`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${darkMode ? 'border-zinc-800' : 'border-neutral-200'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-xl font-black font-sans ${darkMode ? 'text-zinc-100' : 'text-black'}`}>User Messages & Inquiries</h2>
                    {unreadMessagesCount > 0 && (
                      <span className="px-2.5 py-0.5 text-xs font-black bg-red-600 text-white rounded-full">
                        {unreadMessagesCount} Unread
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-neutral-700'} mt-1`}>
                    Manage review requests, sponsorship proposals, and feedback submitted by site visitors.
                  </p>
                </div>
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${darkMode ? 'bg-red-950/40 text-red-500' : 'bg-red-50 text-red-600'}`}>
                  <MessageSquare size={20} />
                </div>
              </div>

              {/* Filters and search bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`} />
                  <input
                    type="text"
                    placeholder="Search by sender, email, subject..."
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border ${
                      darkMode ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-white border-neutral-300 text-black placeholder-neutral-500'
                    } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                  />
                  {messageSearch && (
                    <button onClick={() => setMessageSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setMessageFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                      messageFilter === 'all'
                        ? darkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-neutral-900 text-white'
                        : darkMode ? 'bg-zinc-800 text-zinc-300 hover:text-white' : 'bg-neutral-100 text-black hover:bg-neutral-200'
                    }`}
                  >
                    All Messages ({messages.length})
                  </button>
                  <button
                    onClick={() => setMessageFilter('unread')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                      messageFilter === 'unread'
                        ? 'bg-red-600 text-white'
                        : darkMode ? 'bg-zinc-800 text-zinc-300 hover:text-white' : 'bg-neutral-100 text-black hover:bg-neutral-200'
                    }`}
                  >
                    Unread ({unreadMessagesCount})
                  </button>
                  <button
                    onClick={() => setMessageFilter('read')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                      messageFilter === 'read'
                        ? darkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-neutral-900 text-white'
                        : darkMode ? 'bg-zinc-800 text-zinc-300 hover:text-white' : 'bg-neutral-100 text-black hover:bg-neutral-200'
                    }`}
                  >
                    Read ({messages.length - unreadMessagesCount})
                  </button>
                </div>
              </div>

              {/* Messages Table / List */}
              {messages.filter((msg) => {
                const matchesSearch = 
                  msg.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                  msg.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
                  msg.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
                  msg.message.toLowerCase().includes(messageSearch.toLowerCase());
                if (messageFilter === 'unread') return matchesSearch && !msg.read;
                if (messageFilter === 'read') return matchesSearch && msg.read;
                return matchesSearch;
              }).length === 0 ? (
                <div className={`py-12 text-center space-y-3 border border-dashed rounded-2xl ${darkMode ? 'border-zinc-800' : 'border-neutral-300'}`}>
                  <Inbox size={32} className={`mx-auto ${darkMode ? 'text-zinc-500' : 'text-neutral-500'}`} />
                  <p className={`text-xs font-bold ${darkMode ? 'text-zinc-400' : 'text-neutral-700'}`}>No messages found matching your filter criteria.</p>
                </div>
              ) : (
                <div className={`overflow-x-auto rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] uppercase font-extrabold ${darkMode ? 'border-zinc-800 text-zinc-400' : 'border-neutral-200 text-neutral-800'}`}>
                        <th className="p-4">Status</th>
                        <th className="p-4">Sender</th>
                        <th className="p-4">Subject & Excerpt</th>
                        <th className="p-4">Submitted Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`text-xs divide-y ${darkMode ? 'divide-zinc-800 text-zinc-200' : 'divide-neutral-200 text-black'}`}>
                      {messages.filter((msg) => {
                        const matchesSearch = 
                          msg.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                          msg.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
                          msg.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
                          msg.message.toLowerCase().includes(messageSearch.toLowerCase());
                        if (messageFilter === 'unread') return matchesSearch && !msg.read;
                        if (messageFilter === 'read') return matchesSearch && msg.read;
                        return matchesSearch;
                      }).map((msg) => (
                        <tr
                          key={msg.id}
                          className={`transition ${
                            !msg.read 
                              ? darkMode ? 'bg-red-950/20 hover:bg-red-950/30 font-bold text-zinc-100' : 'bg-red-50/60 hover:bg-red-50 font-bold text-black' 
                              : darkMode ? 'hover:bg-zinc-800/50 text-zinc-200' : 'hover:bg-neutral-50 text-black'
                          }`}
                        >
                          <td className="p-4 whitespace-nowrap">
                            {!msg.read ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                                Unread
                              </span>
                            ) : (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-neutral-100 text-neutral-800'
                              }`}>
                                <CheckCircle2 size={10} />
                                Read
                              </span>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <div className={`font-extrabold ${darkMode ? 'text-zinc-100' : 'text-black'}`}>{msg.name}</div>
                              <div className={`text-[11px] ${darkMode ? 'text-zinc-400' : 'text-neutral-700'}`}>{msg.email}</div>
                              {msg.phone && <div className={`text-[10px] ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>{msg.phone}</div>}
                            </div>
                          </td>
                          <td className="p-4 max-w-md">
                            <div className="space-y-1">
                              <div className={`font-extrabold line-clamp-1 ${darkMode ? 'text-zinc-100' : 'text-black'}`}>{msg.subject}</div>
                              <div className={`text-[11px] line-clamp-2 font-normal leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-neutral-800'}`}>{msg.message}</div>
                            </div>
                          </td>
                          <td className={`p-4 whitespace-nowrap text-[11px] ${darkMode ? 'text-zinc-400' : 'text-neutral-700'}`}>
                            {new Date(msg.submittedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="p-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => {
                                setSelectedMessage(msg);
                                if (!msg.read) {
                                  markMessageRead(msg.id, true);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-extrabold text-[11px] transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Eye size={12} />
                              View
                            </button>

                            <button
                              onClick={() => markMessageRead(msg.id, !msg.read)}
                              className={`px-2.5 py-1.5 border rounded-lg font-bold text-[11px] transition cursor-pointer ${
                                darkMode ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300' : 'border-neutral-300 hover:bg-neutral-100 text-black'
                              }`}
                              title={msg.read ? "Mark as Unread" : "Mark as Read"}
                            >
                              {msg.read ? "Unread" : "Read"}
                            </button>

                            <button
                              onClick={() => setDeleteTarget({ type: 'message', id: msg.id, name: `Message from ${msg.name}` })}
                              className="p-1.5 text-neutral-500 hover:text-red-600 transition cursor-pointer inline-block"
                              title="Delete Message"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal for viewing full message */}
            {selectedMessage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                <div className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 ${
                  darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-black'
                }`}>
                  <div className={`flex items-start justify-between pb-4 border-b ${darkMode ? 'border-zinc-800' : 'border-neutral-200'}`}>
                    <div className="space-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        darkMode ? 'bg-red-950 text-red-400' : 'bg-red-100 text-red-700'
                      }`}>
                        Message Detail
                      </span>
                      <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-black'}`}>{selectedMessage.subject}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className={`p-2 rounded-full transition cursor-pointer ${
                        darkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-600 hover:text-black'
                      }`}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 rounded-2xl border ${
                    darkMode ? 'bg-zinc-800/50 border-zinc-800' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <div>
                      <span className={`font-bold block text-[10px] uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>From Name</span>
                      <span className={`font-black text-sm ${darkMode ? 'text-zinc-100' : 'text-black'}`}>{selectedMessage.name}</span>
                    </div>
                    <div>
                      <span className={`font-bold block text-[10px] uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Email Address</span>
                      <a href={`mailto:${selectedMessage.email}`} className="font-bold text-red-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <span className={`font-bold block text-[10px] uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Phone Number</span>
                        <a href={`tel:${selectedMessage.phone}`} className={`font-bold hover:underline ${darkMode ? 'text-zinc-100' : 'text-black'}`}>
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className={`font-bold block text-[10px] uppercase ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Submitted At</span>
                      <span className={`font-bold ${darkMode ? 'text-zinc-100' : 'text-black'}`}>
                        {new Date(selectedMessage.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>Message Content</label>
                    <div className={`p-4 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap font-normal ${
                      darkMode ? 'bg-zinc-800/40 border-zinc-800 text-zinc-100' : 'bg-neutral-50 border-neutral-200 text-black'
                    }`}>
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t ${darkMode ? 'border-zinc-800' : 'border-neutral-200'}`}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          markMessageRead(selectedMessage.id, !selectedMessage.read);
                          setSelectedMessage({ ...selectedMessage, read: !selectedMessage.read });
                        }}
                        className={`px-3 py-2 border text-xs font-bold rounded-xl transition cursor-pointer ${
                          darkMode ? 'border-zinc-700 hover:bg-zinc-800 text-white' : 'border-neutral-300 hover:bg-neutral-100 text-black'
                        }`}
                      >
                        {selectedMessage.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'message', id: selectedMessage.id, name: `Message from ${selectedMessage.name}` })}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-200 dark:shadow-none"
                    >
                      <Send size={14} />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CUSTOM DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-6 ${
              darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-black'
            }`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-2xl shrink-0">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className={`font-extrabold text-base ${darkMode ? 'text-white' : 'text-black'}`}>Confirm Deletion</h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-neutral-500'}`}>This action will permanently delete this record.</p>
                </div>
              </div>

              <p className={`text-sm ${darkMode ? 'text-zinc-200' : 'text-neutral-800'}`}>
                Are you sure you want to delete <span className="font-extrabold text-red-600 dark:text-red-400">"{deleteTarget.name}"</span>?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    darkMode ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-md shadow-red-600/20"
                >
                  {isSubmitting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      <span>Yes, Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
