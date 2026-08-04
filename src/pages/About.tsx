import React from 'react';
import { Award, ShieldCheck, Heart, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const About: React.FC = () => {
  const { settings, currentUser } = useApp();

  const eyebrow = settings?.aboutEyebrow || "Who We Are";
  const title = settings?.aboutTitle || "About Food Review Bangladesh";
  const description = settings?.aboutDescription || "We are Bangladesh's premier, independent culinary community. Our staff and moderators travel across the country to bring you unbiased reviews, high-definition videos, and exclusive discount coupons.";

  const card1Title = settings?.aboutCard1Title || "Unbiased Ratings";
  const card1Desc = settings?.aboutCard1Desc || "We pay for our meals. Our reviews represent honest assessments of quality, price, and cleanliness.";

  const card2Title = settings?.aboutCard2Title || "Trusted Coupons";
  const card2Desc = settings?.aboutCard2Desc || "We coordinate directly with restaurant managements to offer real, working discount codes.";

  const card3Title = settings?.aboutCard3Title || "Local Cuisines";
  const card3Desc = settings?.aboutCard3Desc || "From Old Dhaka's traditional Kacchi Biriyani to Banani's gourmet burgers, we cover everything.";

  const storyTitle = settings?.aboutStoryTitle || "Our Culinary Journey";
  const storyP1 = settings?.aboutStoryParagraph1 || "Food Review Bangladesh started as a small group of passionate food critics in Dhaka. Realizing there was no single resource compiling both detailed text write-ups, video walkthroughs, and verified discount coupons in a beautiful visual interface, we built this premium restaurant platform.";
  const storyP2 = settings?.aboutStoryParagraph2 || "Today, our platform has verified over 150 restaurants, saved users hundreds of thousands of BDT in discount coupon redemptions, and expanded to represent cities beyond Dhaka, including Chittagong, Sylhet, and Rajshahi.";

  return (
    <div className="bg-neutral-50 min-h-screen py-16 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Admin Quick Edit Button */}
        {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
          <div className="flex justify-end mb-6">
            <Link
              to="/admin"
              state={{ activeTab: 'contact' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition cursor-pointer border border-neutral-700"
            >
              <Edit3 size={14} /> Edit About Page Details
            </Link>
          </div>
        )}

        <div className="text-center space-y-4 mb-16">
          <span className="text-red-600 font-black tracking-widest uppercase text-xs">{eyebrow}</span>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight font-sans">
            {title}
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Vision blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Award size={20} />
            </div>
            <h3 className="font-extrabold text-neutral-800 text-base">{card1Title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{card1Desc}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-extrabold text-neutral-800 text-base">{card2Title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{card2Desc}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Heart size={20} />
            </div>
            <h3 className="font-extrabold text-neutral-800 text-base">{card3Title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{card3Desc}</p>
          </div>
        </div>

        {/* Main story panel */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-black font-sans text-neutral-900">{storyTitle}</h2>
          {storyP1 && (
            <p className="text-neutral-600 text-sm leading-relaxed">
              {storyP1}
            </p>
          )}
          {storyP2 && (
            <p className="text-neutral-600 text-sm leading-relaxed">
              {storyP2}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
