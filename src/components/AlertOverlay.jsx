import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

const AlertOverlay = ({ alert, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [alert]);

  if (!alert && !visible) return null;

  return (
    <div className={`alert-overlay ${visible ? 'show' : 'hide'}`}>
      <div className="alert-content">
        <div className="alert-icon-wrapper">
          <Bell size={20} className="alert-icon" />
        </div>
        <div className="alert-text">
          <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Smart Alert</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{alert?.message}</p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="close-btn">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AlertOverlay;
