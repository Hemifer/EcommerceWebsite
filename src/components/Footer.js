// Footer.js
import React, { useState } from 'react';
import HelpModal from './HelpModal';
import './Footer.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../context/translations';

function Footer() {
  const { language } = useLanguage(); // Get the current language from the context
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHelpClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <footer className="footer">
      <p className="footer-text">
        © 2024 HemiMerce. {translations[language].allRightsReserved}
      </p>
      <button className="footer-help-button" onClick={handleHelpClick}>
        {translations[language].needHelp}
      </button>
      <HelpModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </footer>
  );
}

export default Footer;