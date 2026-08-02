import React from 'react';
import { Award, ShieldCheck, Heart, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-red-600 font-black tracking-widest uppercase text-xs">Who We Are</span>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight font-sans">
            About Food Review Bangladesh
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
            We are Bangladesh's premier, independent culinary community. Our staff and moderators travel across the country to bring you unbiased reviews, high-definition videos, and exclusive discount coupons.
          </p>
        </div>

        {/* Vision blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Award size={20} />
            </div>
            <h3 className="font-extrabold text-neutral-800 text-base">Unbiased Ratings</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">We pay for our meals. Our reviews represent honest assessments of quality, price, and cleanliness.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-extrabold text-neutral-800 text-base">Trusted Coupons</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">We coordinate directly with restaurant managements to offer real, working discount codes.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Heart size={20} />
            </div>
            <h3 className="font-extrabold text-neutral-800 text-base">Local Cuisines</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">From Old Dhaka's traditional Kacchi Biriyani to Banani's gourmet burgers, we cover everything.</p>
          </div>
        </div>

        {/* Main story panel */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-black font-sans text-neutral-900">Our Culinary Journey</h2>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Food Review Bangladesh started as a small group of passionate food critics in Dhaka. Realizing there was no single resource compiling both detailed text write-ups, video walkthroughs, and verified discount coupons in a beautiful visual interface, we built this premium restaurant platform.
          </p>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Today, our platform has verified over 150 restaurants, saved users hundreds of thousands of BDT in discount coupon redemptions, and expanded to represent cities beyond Dhaka, including Chittagong, Sylhet, and Rajshahi.
          </p>
        </div>
      </div>
    </div>
  );
};
