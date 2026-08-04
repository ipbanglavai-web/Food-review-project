import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Tag, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopRestaurantsSection: React.FC = () => {
  const { banners, offers } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Drag and Scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // High quality JPG style restaurant voucher banners fallback
  const staticBanners = [
    {
      id: 'banner-kacchi-bhai',
      restaurantName: 'কাচ্চি ভাই (Kacchi Bhai)',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
      discount: '20% OFF',
      tagline: 'শাহী রাজকীয় কাচ্চি ধামাকা',
      code: 'KACCHI20',
      minOrder: 'Kacchi Platters & Borhani',
    },
    {
      id: 'banner-chillox',
      restaurantName: 'Chillox Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      discount: 'FLAT 50% OFF',
      tagline: 'জুসি & স্পাইসি স্ম্যাশ বার্গার',
      code: 'CHILLOX50',
      minOrder: 'On Double & Triple Burgers',
    },
    {
      id: 'banner-pizza-hut',
      restaurantName: 'Pizza Hut Bangladesh',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      discount: 'BUY 1 GET 1 FREE',
      tagline: 'ফ্যামিলি পিৎজা ফেস্ট',
      code: 'PIZZA2X',
      minOrder: 'Medium & Large Pan Pizza',
    },
    {
      id: 'banner-secret-recipe',
      restaurantName: 'Secret Recipe',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      discount: '25% DISCOUNT',
      tagline: 'সুইট ডিলাইটস & কফি',
      code: '',
      minOrder: 'All Signature Cakes & Coffee',
    },
  ];

  // Dynamic banners created by admin from Firestore/context
  const adminBanners = banners.map((b) => ({
    id: b.id,
    restaurantName: b.restaurantName || b.title || 'Top Restaurant',
    image: b.imageUrl || 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    discount: b.discount || 'SPECIAL DEAL',
    tagline: b.tagline || b.subtitle || '',
    code: b.code || '',
    minOrder: b.minOrder || b.description || '',
  }));

  const activeBanners = adminBanners.length > 0 ? adminBanners : staticBanners;

  // Dynamic offers from app context converted to banner cards
  const dynamicOfferCards = offers.map((off) => ({
    id: `dynamic-${off.id}`,
    restaurantName: off.restaurantName,
    image: off.thumbnail || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    discount: `${off.discountPercentage}% OFF`,
    tagline: off.caption,
    code: off.couponCode,
    minOrder: off.shortDescription || (off.location ? `Branch: ${off.location}` : off.category),
  }));

  const allCards = [...activeBanners, ...dynamicOfferCards];
  // Triple the array for smooth infinite marquee looping
  const infiniteCards = [...allCards, ...allCards, ...allCards];

  // Auto-scroll loop using requestAnimationFrame
  useEffect(() => {
    let animId: number;

    const scrollStep = () => {
      if (scrollRef.current && !isInteracting && !isMouseDown) {
        const container = scrollRef.current;
        container.scrollLeft += 0.8;

        // Loop seamlessly back when reaching end of 1/3 of content
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll * 2) {
          container.scrollLeft = maxScroll;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft = maxScroll;
        }
      }
      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [isInteracting, isMouseDown]);

  // Set initial scroll position to middle third
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
    }
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setIsInteracting(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
    resumeAutoScrollAfterDelay();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  // Touch handlers for mobile fingers swiping
  const handleTouchStart = () => {
    setIsInteracting(true);
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    resumeAutoScrollAfterDelay();
  };

  const resumeAutoScrollAfterDelay = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2000); // Resume auto scroll 2 seconds after user stops touching/dragging
  };

  return (
    <section className="w-full py-8 bg-neutral-50/80 border-t border-neutral-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        {/* Header Layout: "Top Restaurants" + Horizontal Line (No Arrows as requested) */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-sans whitespace-nowrap flex items-center gap-2">
            Top Restaurants
          </h2>
          <div className="flex-1 h-[1.5px] bg-neutral-300 dark:bg-neutral-700"></div>
        </div>
      </div>

      {/* Touch & Mouse Draggable Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsInteracting(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full overflow-x-auto no-scrollbar py-2 select-none cursor-grab active:cursor-grabbing px-4 sm:px-6 lg:px-8"
        style={{ scrollBehavior: isMouseDown ? 'auto' : 'smooth' }}
      >
        <div className="flex gap-5 items-stretch w-max">
          {infiniteCards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="shrink-0 w-[280px] sm:w-[320px] h-[200px] relative text-white rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden border-2 border-red-500/60 hover:border-red-500 shadow-xl group cursor-pointer bg-neutral-900 transition-transform duration-300 hover:scale-[1.02]"
            >
              {/* 100% Clear Crisp JPG Background Image */}
              <img
                src={card.image}
                alt={card.restaurantName}
                className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              />

              {/* Light gradient strictly at top and bottom to ensure text readability while leaving center food 100% clear */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/85 pointer-events-none" />

              {/* TOP LEFT: Restaurant Name in White with Black Shadow Glow + Yellow Discount below */}
              <div className="z-10 flex items-start justify-between w-full">
                <div className="text-left pr-2 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/10">
                  <div className="text-sm sm:text-base font-black text-white leading-tight tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,1)] font-sans flex items-center gap-1.5">
                    <Sparkles size={14} className="text-yellow-400 shrink-0" />
                    <span className="line-clamp-1">{card.restaurantName}</span>
                  </div>
                  {/* Discount Number in Yellow with Black Shadow Glow */}
                  <div className="text-xl sm:text-2xl font-black text-yellow-400 leading-none mt-0.5 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                    {card.discount}
                  </div>
                </div>

                <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-400/50 shadow-lg shrink-0 drop-shadow-md">
                  TOP DEAL
                </span>
              </div>

              {/* Tagline / Subtitle */}
              {card.tagline && (
                <div className="z-10 text-[11px] text-amber-100 font-bold line-clamp-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 w-fit drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] my-auto">
                  {card.tagline}
                </div>
              )}

              {/* BOTTOM: Coupon Copy Bar or Tagline Detail */}
              {card.code && card.code.trim().length > 0 ? (
                <div className="z-10 bg-neutral-950/85 backdrop-blur-md rounded-xl p-2 border border-red-500/40 shadow-xl flex items-center justify-between gap-2 mt-auto">
                  <div className="text-left min-w-0 flex-1 pl-1">
                    <div className="text-[9px] font-black uppercase text-yellow-400 tracking-wider">CODE</div>
                    <div className="text-xs sm:text-sm font-black tracking-wider text-white truncate drop-shadow-xs">
                      {card.code}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopy(card.code, e)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-md cursor-pointer shrink-0 border border-red-400/40 active:scale-95"
                  >
                    {copiedCode === card.code ? (
                      <>
                        <Check size={13} className="text-amber-300" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="z-10 mt-auto flex items-center justify-between pt-1">
                  {card.minOrder ? (
                    <span className="text-[11px] font-black text-amber-200 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 truncate shadow-md">
                      {card.minOrder}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


