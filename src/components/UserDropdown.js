import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; // Import the language context
import { translations } from '../context/translations'; // Import translations

function UserDropdown({ currentUser, userInfoVisible, handleSignOut }) {
  const navigate = useNavigate();
  const { language } = useLanguage(); // Get the current language from context

  // Get translations based on the current language
  const translate = (key) => translations[language][key] || key;

  return (
    <div className={`user-info-dropdown ${userInfoVisible ? 'visible' : 'hidden'}`}>
      <h3 className="account-title">{translate('accountPageTitle')}</h3>
      <p>{translate('email')}: {currentUser.email}</p>
      <div>{translate('username')}: {currentUser.userName || 'N/A'}</div> {/* Ensure you access userName */}
      <button className="edit-account-button" onClick={() => navigate('/account')}>
        {translate('edit')}
      </button>
      <button className="sign-out-button" onClick={handleSignOut}>
        {translate('signOut')} {/* You can add 'signOut' to translations.js if needed */}
      </button>
    </div>
  );
}
export default UserDropdown;



