import React, { useState } from 'react';
import './Popup.css';
import type { PasswordVerifyRequest, PasswordVerifyResponse } from './types';

const Popup: React.FC = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    setMessage('');
    try {
      const req: PasswordVerifyRequest = { password };
      const res = await fetch('http://localhost/verifyPassword.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      const data: PasswordVerifyResponse = await res.json();
      if (data.success) {
        setMessage('✅ ' + data.message);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Network error or backend unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-container">
      <h2>Securium</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="popup-input"
      />
      <button
        onClick={handleUnlock}
        className="popup-button"
        disabled={loading || !password}
      >
        {loading ? 'Unlocking...' : 'Unlock'}
      </button>
      <div className="popup-message">{message}</div>
      <a href="#" className="popup-link">Forgot password?</a>
    </div>
  );
};

export default Popup;