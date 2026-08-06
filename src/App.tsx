import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TopRestaurantsSection } from './components/TopRestaurantsSection';
import { Home } from './pages/Home';
import { ReviewDetails } from './pages/ReviewDetails';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// ScrollToTop helper component to reset window scroll position on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
};

// Layout wrapper that conditionally shows Navbar and Footer
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';

  // Toggle state for global search
  const [searchOpen, setSearchOpen] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {/* Show navigation except on admin views */}
      {!isAdminPage && !isLoginPage && (
        <Navbar 
          onSearchOpen={() => setSearchOpen(true)} 
          onScrollToSection={handleScrollToSection}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home searchOpen={searchOpen} setSearchOpen={setSearchOpen} />} />
          <Route path="/review/:id" element={<ReviewDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Fallback route */}
          <Route path="*" element={<Home searchOpen={searchOpen} setSearchOpen={setSearchOpen} />} />
        </Routes>
      </main>

      {/* Show top restaurants marquee and footer except on admin views */}
      {!isAdminPage && !isLoginPage && (
        <>
          <TopRestaurantsSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default function App() {
  useEffect(() => {
    // Smoothly fade out initial preloader after React has rendered first frame
    const loader = document.getElementById('initial-preloader');
    if (loader) {
      const timer = setTimeout(() => {
        loader.classList.add('loaded');
        setTimeout(() => {
          loader.remove();
        }, 500);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleHide = () => {
      try {
        sessionStorage.setItem('tab_hidden_time', Date.now().toString());
      } catch (_) {}
    };

    const handleShow = () => {
      try {
        const savedTimeStr = sessionStorage.getItem('tab_hidden_time');
        if (savedTimeStr) {
          const hiddenTime = parseInt(savedTimeStr, 10);
          if (hiddenTime > 0) {
            const secondsAway = (Date.now() - hiddenTime) / 1000;
            if (secondsAway >= 60) {
              sessionStorage.removeItem('tab_hidden_time');
              window.location.reload();
              return;
            }
          }
        }
      } catch (_) {}
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleHide();
      } else if (document.visibilityState === 'visible') {
        handleShow();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', handleHide);
    window.addEventListener('pageshow', handleShow);
    window.addEventListener('blur', handleHide);
    window.addEventListener('focus', handleShow);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', handleHide);
      window.removeEventListener('pageshow', handleShow);
      window.removeEventListener('blur', handleHide);
      window.removeEventListener('focus', handleShow);
    };
  }, []);

  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
}
