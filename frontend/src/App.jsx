import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VarganiPage from './pages/VarganiPage';
import SchedulePage from './pages/SchedulePage';
import GalleryPage from './pages/GalleryPage';
import AdminDashboard from './pages/AdminDashboard';
import UserAuthModal from './components/UserAuthModal';
import CustomScrollbarManager from './components/CustomScrollbarManager';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);

  // Global Festival Settings state
  const [settings, setSettings] = useState({
    festivalYear: '2026',
    establishmentYear: '1977',
    mandalName: 'यंगस्टार मित्र मंडळ',
    editionNo: 49,
    editionText: '४९ वे वर्ष'
  });

  // Scroll to top of page immediately whenever activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Fetch settings & user session on mount
  useEffect(() => {
    fetchSettings();
    const storedUser = localStorage.getItem('ymm_user_session');
    if (storedUser) {
      try {
        setUserSession(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data);
      }
    } catch (err) {
      console.log('Using default settings');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFF8F6] text-[#281714]">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        settings={settings}
        userSession={userSession}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      
      <main className="pt-20 sm:pt-28 flex-grow">
        {activeTab === 'home' && (
          <Home 
            setActiveTab={setActiveTab} 
            settings={settings}
            userSession={userSession}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
        {activeTab === 'vargani' && (
          <VarganiPage 
            settings={settings}
            userSession={userSession}
          />
        )}
        {activeTab === 'schedule' && (
          <SchedulePage 
            setActiveTab={setActiveTab} 
            settings={settings}
          />
        )}
        {activeTab === 'gallery' && (
          <GalleryPage 
            setActiveTab={setActiveTab} 
            settings={settings}
          />
        )}
        {activeTab === 'admin' && (
          <AdminDashboard 
            settings={settings}
            onSettingsUpdate={fetchSettings}
          />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />

      <UserAuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userSession={userSession}
        setUserSession={setUserSession}
      />

      <CustomScrollbarManager />
    </div>
  );
}

