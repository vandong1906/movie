import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './booking.css';
import { useAuth } from '../hook/AuthenContext';

interface Show {
  show_id: number;
  show_time: string;
  movie_id: number;
  theater_id: number;
  movie: {
    movie_id: number;
    movie_name: string;
    genre: string;
    duration: string;
    path: string;
  };
  theater: {
    theater_id: number;
    theater_name: string;
    location: string;
  };
  tickets: any[];
}

interface TicketPayload {
  orderInfo: string;
  seat_number: string;
  price: number;
  show_id: string;
  user_id: string;
  status: string;
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
  const { user } = useAuth();
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

        // Lấy thẳng tên phim từ data.movie
        setMovieName(data.movie?.movie_name || 'N/A');

      } catch (error) {
        setMovieName('Không lấy được tên phim');
      }
    };

    fetchShowDetails();
  }, [showId]);

 

  const handlePayment = async () => {
    const seatData = JSON.parse(localStorage.getItem('selectedSeats') || '{}');
    if (!seatData || new Date().getTime() > seatData.expirationTime) {
      alert('Ghế đã hết hạn, vui lòng chọn lại ghế');
      // Xóa trạng thái ghế trong localStorage
      localStorage.removeItem('selectedSeats');
      return;
    }

    try {
      const transactionId = Date.now().toString();

      // Tạo vé duy nhất cho tất cả các ghế
      const ticketRes = await fetch('https://backendmovie-10gn.onrender.com/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderInfo,
          seat_number: seatNumbers.join(','), // Gửi tất cả ghế trong một vé
          price: total, // Tổng giá tiền cho tất cả ghế
          show_id: showId,
          user_id: user?.user_id,
          status: 'pending',
        } as TicketPayload),
      });

      const ticketData: TicketResponse = await ticketRes.json();

      if (!ticketRes.ok || !ticketData.ticket_id) {
        throw new Error(`Không tạo được vé: ${ticketData.message || ticketRes.statusText}`);
      }

      // Thanh toán vé vừa tạo
      const paymentRes = await fetch('https://backendmovie-10gn.onrender.com/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketData.ticket_id, // ID của vé vừa tạo
          amount: total, // Tổng số tiền thanh toán
          payment_method: 'credit_card',
          transaction_id: transactionId,
        } as PaymentPayload),
      });

      const paymentData: PaymentResponse = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.paymentUrl) {
        throw new Error(`Lỗi thanh toán: ${paymentData.message || paymentRes.statusText}`);
      }

      // Sau khi thanh toán thành công, sẽ lưu ghế vào cơ sở dữ liệu
      // Thực hiện xóa ghế khỏi localStorage sau khi thanh toán thành công
      localStorage.removeItem('selectedSeats');

      // Chuyển hướng đến URL thanh toán
      window.location.href = paymentData.paymentUrl;
    } catch (error) {
      console.error('Lỗi tổng thể:', error);
      alert((error as Error).message || 'Có lỗi xảy ra khi thanh toán.');
    }
  };

  const formatCurrencyVND = (amount: number): string => {
    return `₫${amount.toLocaleString('vi-VN')}`;
  };

  // Kiểm tra trạng thái ghế khi component render
  useEffect(() => {
    const seatData = JSON.parse(localStorage.getItem('selectedSeats') || '{}');
    if (seatData && new Date().getTime() > seatData.expirationTime) {
      alert('Ghế đã hết hạn, vui lòng chọn lại ghế');
      localStorage.removeItem('selectedSeats');
      // Cập nhật lại giao diện, ví dụ: reset ghế hoặc đánh dấu ghế là 'sẵn sàng'
    }
  }, []);

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
