import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserDropdown({ currentUser, toggleUserInfo, userInfoVisible, handleSignOut }) {
  const navigate = useNavigate();

  return (
    <div className={`user-info-dropdown ${userInfoVisible ? 'visible' : 'hidden'}`}>
      <h4 className="account-title">Account</h4>
      <div>Email: {currentUser.email}</div>
      <div>Username: {currentUser.userName || 'N/A'}</div> {/* Ensure you access userName */}
      <button className="edit-account-button" onClick={() => navigate('/account')}>
        Edit Account
      </button>
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

export default UserDropdown;


