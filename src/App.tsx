import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ReviewDetails } from './pages/ReviewDetails';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

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

      {/* Show footer except on admin views */}
      {!isAdminPage && !isLoginPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
}
