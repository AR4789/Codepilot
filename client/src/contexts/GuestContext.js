import React, { createContext, useContext, useState, useEffect } from 'react';

const GuestContext = createContext();

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

export const GuestProvider = ({ children }) => {
  const [guestCredits, setGuestCredits] = useState(5);
  const [guestId, setGuestId] = useState(null);
  const [isGuestLimitReached, setIsGuestLimitReached] = useState(false);

  // Generate a unique guest fingerprint
  const generateGuestFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Guest fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      window.screen.width + 'x' + window.screen.height,
      window.screen.colorDepth,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.deviceMemory || 'unknown'
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  };

  // Initialize guest tracking
  useEffect(() => {
    const initializeGuest = () => {
      const fingerprint = generateGuestFingerprint();
      setGuestId(fingerprint);
      
      // Check multiple storage methods
      const localStorageKey = `guest_credits_${fingerprint}`;
      const sessionStorageKey = `guest_session_${fingerprint}`;
      const cookieKey = `guest_${fingerprint}`;
      
      // Try to get existing credits from various sources
      let existingCredits = null;
      
      // Check localStorage
      const localCredits = localStorage.getItem(localStorageKey);
      if (localCredits !== null) {
        existingCredits = parseInt(localCredits);
      }
      
      // Check sessionStorage
      const sessionCredits = sessionStorage.getItem(sessionStorageKey);
      if (sessionCredits !== null && existingCredits === null) {
        existingCredits = parseInt(sessionCredits);
      }
      
      // Check cookies
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${cookieKey}=`));
      if (cookieValue && existingCredits === null) {
        existingCredits = parseInt(cookieValue.split('=')[1]);
      }
      
      // Set credits based on existing data or default to 5
      const credits = existingCredits !== null ? existingCredits : 5;
      setGuestCredits(credits);
      setIsGuestLimitReached(credits <= 0);
      
      // Store in all locations for redundancy
      localStorage.setItem(localStorageKey, credits.toString());
      sessionStorage.setItem(sessionStorageKey, credits.toString());
      
      // Set cookie with 30-day expiration
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      document.cookie = `${cookieKey}=${credits}; expires=${expirationDate.toUTCString()}; path=/`;
      
      // Also store a timestamp to track when first used
      const timestampKey = `guest_first_use_${fingerprint}`;
      if (!localStorage.getItem(timestampKey)) {
        localStorage.setItem(timestampKey, Date.now().toString());
      }
    };
    
    initializeGuest();
  }, []);

  const decrementGuestCredit = () => {
    if (guestCredits <= 0) {
      setIsGuestLimitReached(true);
      return false;
    }
    
    const newCredits = guestCredits - 1;
    setGuestCredits(newCredits);
    
    if (newCredits <= 0) {
      setIsGuestLimitReached(true);
    }
    
    // Update all storage locations
    const fingerprint = guestId;
    const localStorageKey = `guest_credits_${fingerprint}`;
    const sessionStorageKey = `guest_session_${fingerprint}`;
    const cookieKey = `guest_${fingerprint}`;
    
    localStorage.setItem(localStorageKey, newCredits.toString());
    sessionStorage.setItem(sessionStorageKey, newCredits.toString());
    
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    document.cookie = `${cookieKey}=${newCredits}; expires=${expirationDate.toUTCString()}; path=/`;
    
    return true;
  };

  const resetGuestCredits = () => {
    // This should only be called after successful registration
    const fingerprint = guestId;
    const localStorageKey = `guest_credits_${fingerprint}`;
    const sessionStorageKey = `guest_session_${fingerprint}`;
    const cookieKey = `guest_${fingerprint}`;
    
    localStorage.removeItem(localStorageKey);
    sessionStorage.removeItem(sessionStorageKey);
    document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    setGuestCredits(5);
    setIsGuestLimitReached(false);
  };

  return (
    <GuestContext.Provider value={{
      guestCredits,
      guestId,
      isGuestLimitReached,
      decrementGuestCredit,
      resetGuestCredits
    }}>
      {children}
    </GuestContext.Provider>
  );
};
