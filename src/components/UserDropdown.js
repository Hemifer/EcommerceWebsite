import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserDropdown({ currentUser, userInfoVisible, handleSignOut }) {
  const navigate = useNavigate();

  return (
    <div className={`user-info-dropdown ${userInfoVisible ? 'visible' : 'hidden'}`}>
      <h3 className="account-title">Account</h3>
      <p>Email: {currentUser.email}</p>
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


