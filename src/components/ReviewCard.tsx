import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, Eye, Star, Play, ExternalLink, Calendar } from 'lucide-react';
import { Review } from '../types';
import { toggleReviewLike, isReviewLikedLocally } from '../dbStore';

interface ReviewCardProps {
  review: Review;
  onLikeChanged?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onLikeChanged }) => {
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(review.likes);
  const [isLiked, setIsLiked] = useState(isReviewLikedLocally(review.id));
  const [showShareToast, setShowShareToast] = useState(false);

  const handleCardClick = () => {
    navigate(`/review/${review.id}`);
  };

  const handleThumbnailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/review/${review.id}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await toggleReviewLike(review.id);
      setIsLiked(res.liked);
      setLikesCount(res.likes);
      if (onLikeChanged) onLikeChanged();
    } catch (e) {
      console.warn("Could not handle like:", e);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/review/${review.id}`;
    const shareData = {
      title: review.seoTitle || `${review.restaurantName} Review`,
      text: review.shortDescription,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback copy
        copyLink(shareUrl);
      }
    } else {
      copyLink(shareUrl);
    }
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const formattedDate = new Date(review.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const hasVideo = !!(review.thumbnailClickLink || review.videoUrl || review.facebookUrl || review.youtubeUrl);

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-neutral-100 shadow-md shadow-neutral-100/50 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 cursor-pointer"
    >
      {/* Toast Alert for Copied Link */}
      {showShareToast && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-neutral-900/95 backdrop-blur-md text-white text-xs font-bold text-center py-2 px-3 rounded-lg shadow-lg">
          Review link copied to clipboard!
        </div>
      )}

      {/* Card Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <img
          src={review.thumbnail}
          alt={review.restaurantName}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Play Button Overlay */}
        <div 
          onClick={handleThumbnailClick}
          className="absolute inset-0 bg-black/10 group-hover:bg-black/25 flex items-center justify-center transition-colors duration-300"
          title="Watch Video Review"
        >
          {hasVideo && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-transform duration-300 group-hover:scale-110 active:scale-95">
              <Play size={20} fill="white" className="ml-0.5" />
            </div>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-neutral-100">
          {review.foodCategory}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-neutral-900/85 backdrop-blur-md text-white text-xs font-extrabold px-2.5 py-1 rounded-lg border border-white/10 shadow-md">
          <Star size={12} fill="#f59e0b" className="text-amber-400" />
          {review.rating.toFixed(1)}
        </div>
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 space-y-2">
          {/* Restaurant Title */}
          <h3 className="text-lg font-extrabold text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1 font-sans">
            {review.restaurantName}
          </h3>

          {/* Location */}
          <p className="text-xs text-neutral-500 line-clamp-1 flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
            {review.location}
          </p>

          {/* Short Description */}
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 pt-1">
            {review.shortDescription}
          </p>
        </div>

        {/* Footer info: Admin, Views, Actions */}
        <div className="mt-5 border-t border-neutral-100 pt-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
              <Calendar size={10} />
              {formattedDate}
            </div>
            <div className="text-xs font-bold text-neutral-700">
              By <span className="text-red-600 font-extrabold">{review.adminName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Views badge */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-50 px-2 py-1 rounded-md">
              <Eye size={12} />
              <span>{review.views}</span>
            </div>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center justify-center h-8 w-8 rounded-full border transition cursor-pointer ${
                isLiked 
                  ? 'bg-red-50 border-red-200 text-red-600' 
                  : 'bg-white border-neutral-200 text-neutral-500 hover:text-red-600 hover:bg-neutral-50'
              }`}
              title={isLiked ? 'Unlike review' : 'Like review'}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-red-600 hover:bg-neutral-50 transition cursor-pointer"
              title="Share review"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
