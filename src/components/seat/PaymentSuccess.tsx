import React from 'react';
import { useNavigate } from 'react-router-dom';
import './payment.css';

const Payment: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };

  return (
    <div className="body-style">
      <div className="container">
        <h1 className="heading">Thanh toán thành công!</h1>
        <p className="message">Cảm ơn bạn đã mua vé. Vé của bạn đã được thanh toán thành công.</p>
        <button className="home-link" onClick={handleHomeClick}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Payment;