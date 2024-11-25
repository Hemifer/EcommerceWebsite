// Footer.js
import React, { useState } from 'react';
import HelpModal from './HelpModal';
import './Footer.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../context/translations';

function Footer() {
  const { language } = useLanguage(); // Get the current language from the context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState(''); // State to show share success message

  const handleHelpClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleShareClick = async () => {
    try {
      const homepageUrl = 'http://localhost:3000/';
      await navigator.clipboard.writeText(homepageUrl);
      setShareMessage(translations[language].shareSuccess || 'Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000); // Clear the message after 3 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setShareMessage(translations[language].shareError || 'Failed to copy link.');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  return (
    <footer className="footer">
      <button className="footer-help-button" onClick={handleHelpClick}>
        {translations[language].needHelp}
      </button>
      <p className="footer-text">
        © 2024 HemiMerce. {translations[language].allRightsReserved}
      </p>
      <button className="footer-share-button" onClick={handleShareClick}>
        {translations[language].shareWebsite}
      </button>
      {shareMessage && <p className="share-message">{shareMessage}</p>}
      <HelpModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </footer>
  );
}

export default Footer;

