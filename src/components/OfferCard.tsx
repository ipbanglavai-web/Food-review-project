import React, { useState } from 'react';
import { Copy, Check, Share2, Tag, Calendar, User } from 'lucide-react';
import { Offer } from '../types';

interface OfferCardProps {
  offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const [copied, setCopied] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(offer.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/offers`;
    const shareText = `Get ${offer.discountPercentage}% OFF at ${offer.restaurantName}! Use code: ${offer.couponCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${offer.restaurantName} - ${offer.discountPercentage}% OFF`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        copyShareLink(shareUrl);
      }
    } else {
      copyShareLink(shareUrl);
    }
  };

  const copyShareLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const isExpired = new Date(offer.expiryDate) < new Date();

  return (
    <div className="relative flex flex-col md:flex-row bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-md shadow-neutral-100/50 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300">
      {/* Copied Link Toast */}
      {showShareToast && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-neutral-900/95 text-white text-xs font-bold text-center py-2 rounded-lg shadow-md">
          Offer link copied to clipboard!
        </div>
      )}

      {/* Coupon Left Ticket Section (Thumbnail) */}
      <div className="relative w-full md:w-1/3 aspect-[16/10] md:aspect-auto bg-neutral-100 min-h-[160px]">
        <img
          src={offer.thumbnail}
          alt={offer.restaurantName}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-black/10" />

        {/* Big Discount Pill */}
        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
          <Tag size={12} />
          {offer.discountPercentage}% OFF
        </div>
      </div>

      {/* Ticket Cut Separator for Visual Coupon Aesthetic */}
      <div className="hidden md:flex flex-col items-center justify-between py-2 relative w-[2px]">
        <div className="w-4 h-4 bg-neutral-50 rounded-full border-r border-b border-neutral-100 -mt-4 shrink-0" />
        <div className="border-l-2 border-dashed border-neutral-200 h-full w-1 my-2" />
        <div className="w-4 h-4 bg-neutral-50 rounded-full border-r border-t border-neutral-100 -mb-4 shrink-0" />
      </div>

      {/* Coupon Right Info Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded">
                {offer.category}
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 mt-1.5 font-sans">
                {offer.restaurantName}
              </h3>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full transition cursor-pointer"
              title="Share offer"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Caption / Headline */}
          <p className="text-sm font-bold text-neutral-800 mt-2">
            {offer.caption}
          </p>

          {/* Short description */}
          <p className="text-xs text-neutral-500 leading-relaxed mt-1 line-clamp-2">
            {offer.shortDescription}
          </p>
        </div>

        {/* Footer coupon logic */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Expiry and publisher info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
              <Calendar size={12} className={isExpired ? 'text-red-500' : 'text-neutral-400'} />
              <span>Expires: {offer.expiryDate}</span>
              {isExpired && (
                <span className="text-red-500 font-extrabold uppercase text-[9px] bg-red-50 px-1 py-0.5 rounded">
                  Expired
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
              <User size={10} />
              <span>Added by: <strong className="text-neutral-700 font-bold">{offer.adminName}</strong></span>
            </div>
          </div>

          {/* Copy Coupon Action */}
          <button
            onClick={handleCopyCode}
            disabled={isExpired}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer select-all ${
              copied 
                ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                : 'bg-black text-white hover:bg-red-600 shadow-md shadow-neutral-100'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            {copied ? (
              <>
                <Check size={14} />
                Code Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy: <strong>{offer.couponCode}</strong></span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
