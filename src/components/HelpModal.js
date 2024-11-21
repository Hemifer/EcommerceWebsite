import React from 'react';
import { useLanguage } from '../context/LanguageContext'; // Import useLanguage to access the current language
import { translations } from '../context/translations'; // Import translations

function HelpModal({ isOpen, onClose }) {
  const { language } = useLanguage(); // Get the current language
  const currentTranslations = translations[language]; // Get the translations based on the current language

  if (!isOpen) return null; // Return nothing if modal is not open

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>{currentTranslations.helpModalTitle}</h2> {/* Use dynamic translations */}
        <p>{currentTranslations.helpModalContactInfo}</p>
        <button style={styles.closeButton} onClick={onClose}>{currentTranslations.close}</button> {/* Dynamic Close button text */}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darken background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'black',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  modalTitle: {
    marginBottom: '15px',
    color: '#FF00FF',
  },
  closeButton: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default HelpModal;

