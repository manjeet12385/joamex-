'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import './WelcomePopup.css';

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide popup on admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Check if user has already closed it in this session
    const hasClosed = sessionStorage.getItem('welcomePopupClosed');
    if (!hasClosed) {
      // Show popup after a slight delay (e.g., 2 seconds) so user sees the site first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('welcomePopupClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="welcome-popup-overlay">
      <div className="welcome-popup-content">
        <button className="welcome-popup-close" onClick={handleClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <h3 className="welcome-popup-title">🎧 24/7 Free Support</h3>
        <p className="welcome-popup-text">
          Have any questions or doubts? Contact our 24/7 free support team for immediate assistance. Directly WhatsApp or Call us.
        </p>
        
        <div className="welcome-popup-buttons">
          <a href="tel:+919014380344" className="welcome-popup-btn btn-call" onClick={handleClose}>
            Call Now
          </a>
          <a 
            href="https://wa.me/919014380344?text=Hi%20Joamex%2C%20I%20want%20to%20book%20a%20home%20service." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="welcome-popup-btn btn-whatsapp"
            onClick={handleClose}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
