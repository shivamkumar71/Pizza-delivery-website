import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem('anshu_accept_cookies');
    if (val === '1') setAccepted(true);
  }, []);

  const accept = () => {
    localStorage.setItem('anshu_accept_cookies', '1');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <p>We use cookies to improve your experience. By continuing, you agree to our use of cookies.</p>
        <div className="cookie-actions">
          <button className="btn btn-secondary" onClick={accept}>Accept</button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
