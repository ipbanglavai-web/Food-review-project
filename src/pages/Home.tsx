import React, { useState, useEffect } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { ReviewCard } from '../components/ReviewCard';
import { OfferCard } from '../components/OfferCard';
import { useApp } from '../context/AppContext';
import { Search, Tag, X, Flame, Newspaper, Filter, ChevronRight, Award, Coffee, Pizza, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Review, Offer } from '../types';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const Home: React.FC<HomeProps> = ({ searchOpen, setSearchOpen }) => {
  const { reviews, offers, categories, banners, loading } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reviews' | 'offers'>('reviews');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Search Results State for the modal
  const [searchFilteredReviews, setSearchFilteredReviews] = useState<Review[]>([]);
  const [searchFilteredOffers, setSearchFilteredOffers] = useState<Offer[]>([]);

  // Update real-time search matches when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchFilteredReviews([]);
      setSearchFilteredOffers([]);
      return;
    }

    const query = searchQuery.toLowerCase();

    const matchedReviews = reviews.filter(
      (r) =>
        r.restaurantName.toLowerCase().includes(query) ||
        r.foodCategory.toLowerCase().includes(query) ||
        r.shortDescription.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query) ||
        r.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    const matchedOffers = offers.filter(
      (o) =>
        o.restaurantName.toLowerCase().includes(query) ||
        o.caption.toLowerCase().includes(query) ||
        o.couponCode.toLowerCase().includes(query) ||
        o.shortDescription.toLowerCase().includes(query) ||
        o.category.toLowerCase().includes(query)
    );

    setSearchFilteredReviews(matchedReviews);
    setSearchFilteredOffers(matchedOffers);
  }, [searchQuery, reviews, offers]);

  // Filter lists based on the category selected from horizontal carousel
  const filteredReviews = reviews.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.foodCategory.toLowerCase() === selectedCategory.toLowerCase();
  });

  const filteredOffers = offers.filter((o) => {
    if (selectedCategory === 'all') return true;
    return o.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        <p className="mt-4 text-sm font-bold text-neutral-500">Loading food review database...</p>
      </div>
    );
  }

  // Find featured items
  const featuredReviews = reviews.filter((r) => r.featured);
  const featuredOffers = offers.filter((o) => o.featured && o.status === 'active');

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      
      {/* Hero peak banner carousel */}
      <HeroCarousel banners={banners} />

      {/* Tabs bar immediately below hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-neutral-100 p-1.5 shadow-inner">
            {/* Top Reviews Tab */}
            <button
              onClick={() => {
                setActiveTab('reviews');
                setSelectedCategory('all');
              }}
              className={`relative flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-neutral-700 hover:text-red-600'
              }`}
            >
              <Newspaper size={20} />
              <span className="sm:hidden">Food Reviews</span>
              <span className="hidden sm:inline">Top Food Reviews</span>
            </button>

            {/* Restaurant Offers Tab */}
            <button
              onClick={() => {
                setActiveTab('offers');
                setSelectedCategory('all');
              }}
              className={`relative flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'offers'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-neutral-700 hover:text-red-600'
              }`}
            >
              <Flame size={20} />
              <span className="sm:hidden">Discount & Offers</span>
              <span className="hidden sm:inline">Restaurant Offers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Feed Section based on active tab */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Category Carousel Row */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Filter size={14} />
              Filter by Category
            </h3>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Horizontally scrollable category row */}
          <div className="flex overflow-x-auto gap-2.5 pb-4 scrollbar-none snap-x">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white text-neutral-700 border border-neutral-100 hover:border-neutral-300'
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition-all snap-start ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'bg-white text-neutral-700 border border-neutral-100 hover:border-neutral-300'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FEED GRID */}
        {activeTab === 'reviews' ? (
          <div>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight font-sans">
                  {selectedCategory === 'all' ? 'Latest Reviews' : `${selectedCategory} Reviews`}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Trusted restaurant ratings and details from Food Review BD moderators
                </p>
              </div>
            </div>

            {/* Empty view check */}
            {filteredReviews.length === 0 ? (
              <div className="text-center py-16 bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
                <AlertCircle className="mx-auto text-neutral-300 mb-3" size={40} />
                <h3 className="text-lg font-bold text-neutral-800">No reviews found</h3>
                <p className="text-sm text-neutral-500 mt-1">There are currently no published reviews matching this category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight font-sans">
                  {selectedCategory === 'all' ? 'Exclusive Food Coupons' : `${selectedCategory} Offers`}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Save big on your next meal. Copy coupons and use during dine-in or checkout!
                </p>
              </div>
            </div>

            {/* Empty view check */}
            {filteredOffers.length === 0 ? (
              <div className="text-center py-16 bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
                <AlertCircle className="mx-auto text-neutral-300 mb-3" size={40} />
                <h3 className="text-lg font-bold text-neutral-800">No discount offers found</h3>
                <p className="text-sm text-neutral-500 mt-1">There are currently no active coupon offers matching this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* SEARCH SYSTEM MODAL OVERLAY (Real-time Instant Search results) */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm"
            />

            {/* Search Container Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="fixed inset-x-4 top-10 md:top-20 z-50 mx-auto max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header Input bar */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex-1 flex items-center gap-3">
                  <Search className="text-red-600 shrink-0" size={22} />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search restaurant reviews, coupon codes, cuisines, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-neutral-800 placeholder-neutral-400 font-medium text-base focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="rounded-full p-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Live search results */}
              <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-6">
                {searchQuery.trim() === '' ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mx-auto">
                      <Search size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-800">What are you craving today?</p>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                        Try searching for <code className="bg-neutral-100 px-1 py-0.5 rounded font-black">Kacchi</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-black">Chillox</code>, or <code className="bg-neutral-100 px-1 py-0.5 rounded font-black">Pizza</code>!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* REVIEWS MATCHED */}
                    {searchFilteredReviews.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1">
                          <Award size={14} />
                          Review Matches ({searchFilteredReviews.length})
                        </h4>
                        <div className="divide-y divide-neutral-100">
                          {searchFilteredReviews.map((rev) => (
                            <div
                              key={rev.id}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery('');
                                navigate(`/review/${rev.id}`);
                              }}
                              className="group flex items-center justify-between py-3 cursor-pointer hover:bg-neutral-50 px-2 rounded-xl transition"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={rev.thumbnail}
                                  alt={rev.restaurantName}
                                  referrerPolicy="no-referrer"
                                  className="h-11 w-11 rounded-lg object-cover shrink-0"
                                />
                                <div>
                                  <div className="text-sm font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                                    {rev.restaurantName}
                                  </div>
                                  <div className="text-xs text-neutral-500 line-clamp-1">
                                    {rev.foodCategory} • {rev.location}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-neutral-400 group-hover:text-red-600 transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* OFFERS MATCHED */}
                    {searchFilteredOffers.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-yellow-600 flex items-center gap-1">
                          <Tag size={14} />
                          Discount Coupon Matches ({searchFilteredOffers.length})
                        </h4>
                        <div className="divide-y divide-neutral-100">
                          {searchFilteredOffers.map((off) => (
                            <div
                              key={off.id}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery('');
                                setActiveTab('offers');
                              }}
                              className="group flex items-center justify-between py-3 cursor-pointer hover:bg-neutral-50 px-2 rounded-xl transition"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={off.thumbnail}
                                  alt={off.restaurantName}
                                  referrerPolicy="no-referrer"
                                  className="h-11 w-11 rounded-lg object-cover shrink-0"
                                />
                                <div>
                                  <div className="text-sm font-bold text-neutral-900 group-hover:text-yellow-600 transition-colors">
                                    {off.restaurantName} - {off.discountPercentage}% OFF
                                  </div>
                                  <div className="text-xs text-neutral-500 line-clamp-1">
                                    Use code <strong className="text-neutral-700 bg-neutral-100 px-1 rounded">{off.couponCode}</strong> • {off.caption}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-neutral-400 group-hover:text-yellow-600 transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchFilteredReviews.length === 0 && searchFilteredOffers.length === 0 && (
                      <div className="text-center py-12 text-neutral-400 text-sm">
                        No reviews or coupons found matching "{searchQuery}"
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
