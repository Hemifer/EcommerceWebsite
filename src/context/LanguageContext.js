// src/context/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // default to English

  const switchLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'fr' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
