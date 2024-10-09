import React from 'react';

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null; // Return nothing if modal is not open

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>Here is some contact info you can use to have any questions answered!</h2>
        <p>Email: <a href="mailto:pistillityler@icloud.com">pistillityler@icloud.com</a></p>
        <p>Phone: <a href="tel:+14389358532">+1(438) 935-8532</a></p>
        <button style={styles.closeButton} onClick={onClose}>Close</button>
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
