import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './booking.css';
import { useAuth } from '../hook/AuthenContext';

interface Show {
  show_time: string;
  movie_id: { name: string };
}

interface TicketPayload {
  orderInfo: string;
  seat_number: string;
  price: number;
  show_id: string;
  id_user: string;
}

interface TicketResponse {
  ticket_id: string;
  message?: string;
}

interface PaymentPayload {
  ticket_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  return_url: string;
}

interface PaymentResponse {
  paymentUrl: string;
  message?: string;
}

const Booking: React.FC = () => {
    const {user} =useAuth();
  const [searchParams] = useSearchParams();
  const showId = searchParams.get('show_id') || '';
  const seatString = searchParams.get('seat_numbers') || '';
  const total = parseInt(searchParams.get('price') ?? '0') || 0;
  const orderInfo = searchParams.get('order_info') || `ORDER-${Date.now()}`;
  const seatNumbers = seatString ? seatString.split(',') : [];
  const seatCount = seatNumbers.length;
  const baseTotal = Math.floor(total / 1.06);
  const serviceFee = total - baseTotal;

  const [movieName, setMovieName] = useState('Đang tải...');
  const [showDate, setShowDate] = useState('--');
  const [showTime, setShowTime] = useState('--');

  useEffect(() => {
    if (!showId) {
      setMovieName('Không có show_id');
      return;
    }

    const fetchShowDetails = async () => {
      try {
        const res = await fetch(`https://backendmovie-10gn.onrender.com/api/shows/${showId}`);
        const data: Show = await res.json();
        const showTimeObj = new Date(data.show_time);
        setShowDate(showTimeObj.toLocaleDateString('vi-VN'));
        setShowTime(
          showTimeObj.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
        console.log(data);
        setMovieName(data.movie_id?.name || 'N/A');
      } catch (error) {
        setMovieName('Không lấy được tên phim');
      }
    };

    fetchShowDetails();
  }, [showId]);

  const handlePayment = async () => {
    const transactionId = Date.now().toString();
    try {
      const seatPrice = seatCount > 0 ? Math.floor(total / seatCount) : 0;
      const createdTickets: string[] = [];

      for (const seat of seatNumbers) {
        const ticketRes = await fetch('https://backendmovie-10gn.onrender.com/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderInfo,
            seat_number: seat,
            price: seatPrice,
            show_id: showId,
            id_user: user?.user_id,
          } as TicketPayload),
        });

        const ticketData: TicketResponse = await ticketRes.json();

        if (!ticketRes.ok || !ticketData.ticket_id) {
          throw new Error(`Không tạo được vé cho ghế ${seat}: ${ticketData.message || ticketRes.statusText}`);
        }

        createdTickets.push(ticketData.ticket_id);
      }

      const ticketId = createdTickets[0];
      const paymentRes = await fetch('https://backendmovie-10gn.onrender.com/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          amount: seatPrice,
          payment_method: 'credit_card',
          transaction_id: transactionId,
       
        } as PaymentPayload),
      });
console.log(paymentRes);
      const paymentData: PaymentResponse = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.paymentUrl) {
        throw new Error(`Lỗi thanh toán: ${paymentData.message || paymentRes.statusText}`);
      }

      window.location.href = paymentData.paymentUrl;
    } catch (error) {
      console.error('Lỗi tổng thể:', error);
      alert((error as Error).message || 'Có lỗi xảy ra khi thanh toán.');
    }
  };

  const formatCurrencyVND = (amount: number): string => {
    return `₫${amount.toLocaleString('vi-VN')}`;
  };

  return (
    <div className="body-style">
      <div className="container">
        <h1 className="heading">Chi tiết vé</h1>
        <div className="section">
          <div className="info-item">
            <p className="label">Tên phim</p>
            <p className="value">{movieName}</p>
          </div>
          <div className="info-item">
            <p className="label">Ngày</p>
            <p className="date-time">
              <span>{showDate}</span>
              <span className="label-inline">Giờ</span>
              <span className="time">{showTime}</span>
            </p>
          </div>
          <div className="info-item">
            <p className="label">
              Ghế (<span>{seatCount}</span>)
            </p>
            <p className="value">{seatCount ? seatNumbers.join(', ') : 'Chưa chọn ghế'}</p>
          </div>
        </div>
        <div className="section">
          <h2 className="subheading">Thông tin vé</h2>
          <div className="info-item">
            <p className="label">User ID</p>
            <p className="value">#{user?.user_id}</p>
          </div>
          <div className="info-item">
            <p className="label">Mã đơn hàng</p>
            <p className="value">{orderInfo}</p>
          </div>
        </div>
        <div className="section">
          <h2 className="subheading">Chi tiết giao dịch</h2>
          <div className="transaction-item">
            <span>Ghế thường</span>
            <span>
              {formatCurrencyVND(baseTotal)} ({seatCount} ghế)
            </span>
          </div>
          <div className="transaction-item">
            <span>Phí dịch vụ (6%)</span>
            <span>{formatCurrencyVND(serviceFee)}</span>
          </div>
          <div className="total">
            <span>Tổng tiền</span>
            <span className="total-amount">{formatCurrencyVND(total)}đ</span>
          </div>
        </div>
        <p className="note">*Vé đã mua không thể trả!</p>
        <button className="pay-button" onClick={handlePayment}>
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Booking;