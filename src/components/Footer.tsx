import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings } = useApp();

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-8 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-neutral-800 pb-12">
          
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-md shadow-red-900/50">
                F
              </span>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                FoodReview<span className="text-yellow-500">BD</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              {settings.description || "The premier platform for authentic food reviews, trusted culinary suggestions, and exclusive restaurant discounts across Bangladesh. Handpicked and reviewed by food experts."}
            </p>
            <div className="flex space-x-4 pt-2">
              <a href={settings.facebookUrl || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <Facebook size={18} />
              </a>
              <a href={settings.youtubeUrl || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <Youtube size={18} />
              </a>
              <a href={settings.instagramUrl || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <Instagram size={18} />
              </a>
              <a href={settings.twitterUrl || "https://twitter.com"} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" state={{ activeTab: 'reviews', selectedCategory: 'all' }} className="hover:text-red-500 transition-colors">Home Feed</Link>
              </li>
              <li>
                <Link to="/" state={{ activeTab: 'reviews', scrollTo: 'reviews', selectedCategory: 'all' }} className="hover:text-red-500 transition-colors">Top Reviews</Link>
              </li>
              <li>
                <Link to="/" state={{ activeTab: 'offers', scrollTo: 'offers', selectedCategory: 'all' }} className="hover:text-red-500 transition-colors">Restaurant Offers</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Popular Food</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" state={{ selectedCategory: 'Best Biriyani', scrollTo: 'reviews' }} className="hover:text-red-500 transition-colors cursor-pointer block">Best Old Dhaka Biriyani</Link>
              </li>
              <li>
                <Link to="/" state={{ selectedCategory: 'Burger', scrollTo: 'reviews' }} className="hover:text-red-500 transition-colors cursor-pointer block">Gourmet Beef Burgers</Link>
              </li>
              <li>
                <Link to="/" state={{ selectedCategory: 'Pizza', scrollTo: 'reviews' }} className="hover:text-red-500 transition-colors cursor-pointer block">Thin Crust Woodfired Pizzas</Link>
              </li>
              <li>
                <Link to="/" state={{ selectedCategory: 'Chinese', scrollTo: 'reviews' }} className="hover:text-red-500 transition-colors cursor-pointer block">Authentic Chinese Platters</Link>
              </li>
              <li>
                <Link to="/" state={{ selectedCategory: 'Desserts', scrollTo: 'reviews' }} className="hover:text-red-500 transition-colors cursor-pointer block">Traditional Desserts & Coffee</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact Info</h3>
            <ul className="space-y-3.5 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
                <span>{settings.contactAddress || "Road 11, Banani Commercial Area, Dhaka - 1213, Bangladesh"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-red-500 shrink-0" />
                <span>{settings.contactEmail || "support@foodreviewbd.com"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-red-500 shrink-0" />
                <span>{settings.contactPhone || "+880 1712-345678"}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Food Review Bangladesh. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">
            Developed with ❤️ by <span className="text-neutral-300 font-bold hover:text-red-500 transition-colors cursor-pointer">Premium Dev Studio BD</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
