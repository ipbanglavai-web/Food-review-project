import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Review } from '../types';
import { 
  Heart, 
  Share2, 
  Eye, 
  Star, 
  Play, 
  ArrowLeft, 
  Calendar, 
  User, 
  MapPin, 
  Award, 
  Video,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { isReviewLikedLocally } from '../dbStore';

export const ReviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reviews, incrementViews, toggleLike } = useApp();

  const [review, setReview] = useState<Review | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);

  // Find the current review
  useEffect(() => {
    if (id && reviews.length > 0) {
      const match = reviews.find((r) => r.id === id);
      if (match) {
        setReview(match);
        setIsLiked(isReviewLikedLocally(match.id));
        setLikesCount(match.likes);
        setViewsCount(match.views);

        // Auto increment view count once per unique session
        incrementViews(match.id).then((updatedViews) => {
          if (updatedViews > 0) {
            setViewsCount(updatedViews);
          }
        });
      }
    }
  }, [id, reviews, incrementViews]);

  if (!review) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        <p className="mt-4 text-sm font-bold text-neutral-500">Retrieving review details...</p>
      </div>
    );
  }

  const handleLike = async () => {
    try {
      const res = await toggleLike(review.id);
      setIsLiked(res.liked);
      setLikesCount(res.likes);
    } catch (e) {
      console.warn("Could not like review:", e);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: review.seoTitle || `${review.restaurantName} - Review`,
      text: review.shortDescription,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const handleWatchVideo = () => {
    const videoRedirect = review.thumbnailClickLink || review.videoUrl || review.facebookUrl || review.youtubeUrl;
    if (videoRedirect) {
      window.open(videoRedirect, '_blank', 'noopener,noreferrer');
    }
  };

  // Find related reviews (same category, excluding this one)
  const relatedReviews = reviews
    .filter((r) => r.foodCategory === review.foodCategory && r.id !== review.id)
    .slice(0, 3);

  const formattedDate = new Date(review.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hasVideo = !!(review.thumbnailClickLink || review.videoUrl || review.facebookUrl || review.youtubeUrl);

  return (
    <div className="bg-neutral-50 min-h-screen pb-20 pt-4">
      
      {/* Toast Alert */}
      {showShareToast && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xl">
          Review link copied to clipboard!
        </div>
      )}

      {/* Master Content Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title details */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider px-3 py-1 rounded">
              {review.foodCategory}
            </span>
            {review.rating >= 4.7 && (
              <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Award size={12} />
                Recommended Badge
              </span>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight font-sans">
            {review.restaurantName}
          </h1>
          
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-500">
            <div className="flex items-center gap-1 bg-white border border-neutral-100 px-2.5 py-1 rounded-md text-neutral-700">
              <Star size={14} fill="#eab308" className="text-yellow-500" />
              <span className="font-extrabold">{review.rating.toFixed(1)} / 5.0 Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>By <strong className="text-neutral-800">{review.adminName}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={14} />
              <span>{viewsCount} public views</span>
            </div>
          </div>
        </div>

        {/* Clickable Large Cover Section */}
        <div 
          onClick={handleWatchVideo}
          className="group relative rounded-3xl overflow-hidden aspect-[16/9] bg-neutral-900 shadow-xl shadow-neutral-200/50 cursor-pointer"
        >
          <img
            src={review.thumbnail}
            alt={review.restaurantName}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300 flex items-center justify-center">
            {hasVideo && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/50 transition-transform duration-300 group-hover:scale-110 active:scale-95">
                  <Play size={32} fill="white" className="ml-1" />
                </div>
                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-black tracking-widest uppercase px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                  Click cover to watch video review
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Like and Share Quick Utilities */}
        <div className="mt-6 flex flex-row items-center gap-3 max-w-sm w-full">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-black text-xs uppercase tracking-wider transition cursor-pointer ${
              isLiked 
                ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-600/10'
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-red-600 shadow-sm'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="whitespace-nowrap">{isLiked ? 'Liked!' : 'Like'} ({likesCount})</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition font-black text-xs uppercase tracking-wider cursor-pointer shadow-sm"
          >
            <Share2 size={16} />
            <span className="whitespace-nowrap">Share</span>
          </button>
        </div>

        {/* Body content with sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
          
          {/* Main Review Text */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-neutral-100 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
                Detailed Culinary Experience
              </h2>
              
              <div 
                className="prose prose-red text-neutral-700 leading-relaxed max-w-none space-y-4"
                dangerouslySetInnerHTML={{ __html: review.description }}
              />

              {/* Tags Section */}
              {review.tags && review.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-neutral-100">
                  <div className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, index) => (
                      <span key={index} className="bg-neutral-50 border border-neutral-100 text-neutral-600 text-xs px-3 py-1.5 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                Review Utilities
              </h3>

              {/* Location Box */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Restaurant Spot</div>
                <div className="flex items-start gap-2 text-sm font-bold text-neutral-800 leading-relaxed">
                  <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{review.location}</span>
                </div>
              </div>

              {/* Direct Link Actions */}
              {hasVideo && (
                <button
                  onClick={handleWatchVideo}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-100 cursor-pointer"
                >
                  <Video size={16} fill="white" />
                  Watch Video Broadcast
                </button>
              )}
            </div>

            {/* Social Share Callout */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-6 text-white space-y-4 shadow-lg shadow-red-100/40">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Share2 size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base">Spread the Deliciousness</h4>
                <p className="text-xs text-red-50/80 leading-relaxed">
                  Share this expert food review on Facebook, WhatsApp, or Messenger with your food buddy list!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-extrabold text-center">
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="bg-white/20 hover:bg-white/30 py-2 rounded-xl transition"
                >
                  Facebook
                </button>
                <button 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this food review: ' + window.location.href)}`, '_blank')}
                  className="bg-white/20 hover:bg-white/30 py-2 rounded-xl transition"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RELATED REVIEWS SECTION */}
        {relatedReviews.length > 0 && (
          <div className="mt-20 pt-10 border-t border-neutral-100">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight font-sans mb-8">
              More reviews in <span className="text-red-600">{review.foodCategory}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedReviews.map((related) => (
                <div 
                  key={related.id}
                  onClick={() => navigate(`/review/${related.id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-lg transition duration-300 cursor-pointer group"
                >
                  <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <img 
                      src={related.thumbnail} 
                      alt={related.restaurantName}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-yellow-500 text-xs font-bold">
                      <Star size={12} fill="currentColor" />
                      <span>{related.rating.toFixed(1)}</span>
                    </div>
                    <h3 className="font-extrabold text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1 text-sm font-sans">
                      {related.restaurantName}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {related.shortDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
