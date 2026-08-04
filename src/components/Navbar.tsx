import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Shield, LogOut, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onSearchOpen?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchOpen, onScrollToSection }) => {
  const { currentUser, logout, settings } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Home', path: '/', section: 'hero' },
    { name: 'Top Reviews', path: '/', section: 'reviews' },
    { name: 'Restaurant Offers', path: '/', section: 'offers' },
    { name: 'Categories', path: '/', section: 'categories' },
    { name: 'About', path: '/about', section: null },
    { name: 'Contact', path: '/contact', section: null },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setIsDrawerOpen(false);
    if (item.path === '/' && item.section) {
      const targetTab = item.section === 'offers' ? 'offers' : 'reviews';
      const targetPath = `/?tab=${targetTab}#${item.section}`;
      
      if (location.pathname !== '/') {
        navigate(targetPath, { state: { activeTab: targetTab, scrollTo: item.section } });
      } else {
        navigate(targetPath, { state: { activeTab: targetTab, scrollTo: item.section }, replace: true });
        window.dispatchEvent(new CustomEvent('nav-section-click', { detail: { section: item.section, activeTab: targetTab } }));
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              {settings.desktopLogo ? (
                <img
                  src={settings.desktopLogo}
                  alt="Food Review BD"
                  className="h-10 max-h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-md shadow-red-200">
                    F
                  </span>
                  <span className="bg-gradient-to-r from-red-600 to-black bg-clip-text text-xl font-black tracking-tight text-transparent font-sans">
                    FoodReview<span className="text-yellow-500">BD</span>
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* Center: Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6 lg:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item)}
                className="text-sm font-semibold text-neutral-700 transition hover:text-red-600 cursor-pointer whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {onSearchOpen && (
              <button
                onClick={onSearchOpen}
                className="flex items-center justify-center h-10 w-10 rounded-full text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                title="Search Food, Reviews, or Offers"
              >
                <Search size={20} />
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition"
                >
                  <Shield size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center justify-center h-10 w-10 rounded-full text-neutral-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-full bg-black px-5 py-2 text-sm font-bold text-white transition hover:bg-neutral-800 shadow-sm whitespace-nowrap"
              >
                <User size={16} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile & Tablet Actions: Hamburger & Search */}
          <div className="flex lg:hidden items-center space-x-2">
            {onSearchOpen && (
              <button
                onClick={onSearchOpen}
                className="flex items-center justify-center h-9 w-9 rounded-full text-neutral-600"
              >
                <Search size={20} />
              </button>
            )}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center h-9 w-9 rounded-full text-neutral-800 hover:bg-neutral-50 transition"
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <rect x="2" y="4" width="20" height="3.5" rx="1.75" fill="#DC2626" />
                <rect x="2" y="10.25" width="20" height="3.5" rx="1.75" fill="#DC2626" />
                <rect x="2" y="16.5" width="20" height="3.5" rx="1.75" fill="#DC2626" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 transition-opacity"
          />

          {/* Content Panel */}
          <div className="relative z-10 flex w-4/5 max-w-sm flex-col bg-white p-6 shadow-2xl h-full transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                {settings.mobileLogo || settings.desktopLogo ? (
                  <img
                    src={settings.mobileLogo || settings.desktopLogo}
                    alt="Food Review BD"
                    className="h-9 max-h-10 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-sm">
                      F
                    </span>
                    <span className="text-lg font-black text-black">
                      FoodReview<span className="text-yellow-500">BD</span>
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full p-2 hover:bg-red-50 transition"
              >
                <X size={22} className="text-red-600" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-8 space-y-5">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item)}
                  className="flex w-full items-center text-left text-lg font-bold text-neutral-800 hover:text-red-600 py-1"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Footer Account Status inside Drawer */}
            <div className="border-t border-neutral-100 pt-6">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                      {currentUser.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">{currentUser.name}</div>
                      <div className="text-xs text-neutral-500 capitalize">{currentUser.role}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/admin"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2.5 text-xs font-bold text-red-600"
                    >
                      <Shield size={14} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        logout();
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-50 py-2.5 text-xs font-bold text-neutral-600 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-100 hover:bg-red-700"
                >
                  <User size={16} />
                  Sign In Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
