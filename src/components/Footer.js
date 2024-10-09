// Footer.js
import React, { useState } from 'react';
import HelpModal from './HelpModal';
import './Footer.css'; 

function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHelpClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <footer className="footer">
      <p className="footer-text">© 2024 HemiMerce. All rights reserved.</p>
      <button className="footer-help-button" onClick={handleHelpClick}>
        Need Help?
      </button>
      <HelpModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </footer>
  );
}

export default Footer;



