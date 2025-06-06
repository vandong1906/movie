import React, { useState, useEffect, JSX } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './seat.css';
import { useAuth } from '../hook/AuthenContext';

interface Ticket {
  seat_number: string;
}



interface ShowData {
  show_id: number;
  tickets: Ticket[];
}

const SeatSelection: React.FC = () => {
  const { user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const seatPrice = 70000;
  const serviceFeeRate = 0.06;
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const cols = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const {showId } =
    location.state || {};

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await fetch(`https://backendmovie-10gn.onrender.com/api/shows/${showId}`);
        const data: ShowData = await res.json();
        setBookedSeats(data.tickets.map(ticket => ticket.seat_number));
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ghế đã mua:', error);
      }
    };

    if (showId) {
      fetchBookedSeats();
    }
  }, [showId]);

  const formatCurrencyVND = (amount: number): string => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleSeatClick = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleClearSelection = () => {
    setSelectedSeats([]);
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ghế!');
      return;
    }

    const baseTotal = selectedSeats.length * seatPrice;
    const serviceFee = baseTotal * serviceFeeRate;
    const total = baseTotal + serviceFee;

    try {
      const orderInfo = `ORDER-${Date.now()}`;
      const createdTicketIds: string[] = [];

      // Lưu thông tin vé tạm thời vào localStorage
      const seatData = {
        seats: selectedSeats,
        orderInfo,
        showId,
        userId: user?.user_id,
        total,
        createdTicketIds,
      };
      localStorage.setItem('seatData', JSON.stringify(seatData));

      // Chuyển hướng người dùng đến trang thanh toán
      const queryParams = new URLSearchParams({
        id_user: user?.user_id ?? "",
        show_id: showId,
        seat_numbers: selectedSeats.join(','),
        price: total.toString(),
        order_info: orderInfo,
      }).toString();

      navigate(`/booking?${queryParams}`);
    } catch (error) {
      console.error('Lỗi khi đặt vé:', error);
      alert(`Lỗi đặt vé: ${(error as Error).message}`);
    }
  };

  const renderSeats = () => {
    const seats: JSX.Element[] = [];
    rows.forEach(row => {
      for (let i = 1; i <= cols; i++) {
        const seatNumber = `${row}${i}`;
        const isBooked = bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        const buttonClass = isBooked
          ? 'seat-button seat-booked'
          : isSelected
          ? 'seat-button seat-selected'
          : 'seat-button seat-available';

        seats.push(
          <button
            key={seatNumber}
            className={buttonClass}
            onClick={() => !isBooked && handleSeatClick(seatNumber)}
            disabled={isBooked}
          >
            {seatNumber}
          </button>
        );
      }
    });
    return seats;
  };

  const renderTotalPrice = () => {
    const baseTotal = selectedSeats.length * seatPrice;
    const serviceFee = baseTotal * serviceFeeRate;
    const totalWithFee = baseTotal + serviceFee;

    return (
      <div>
        <div>
          {formatCurrencyVND(baseTotal)} <span className="footer-subtext">(vé)</span>
        </div>
        <div>
          + {formatCurrencyVND(serviceFee)} <span className="footer-subtext">(phí 6%)</span>
        </div>
        <div className="footer-total">
          {formatCurrencyVND(totalWithFee)} <span className="footer-subtext-total">(tổng)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="body-style">
      {/* Main Seat Section */}
      <div className="main-section">
        <h2 className="heading-style">Seat</h2>
        <div className="seat-grid">{renderSeats()}</div>
        <button className="clear-button" onClick={handleClearSelection}>
          X
        </button>
      </div>

      {/* Footer */}
      <div className="footer">
        <div>
          <p className="footer-label">User ID</p>
          <p className="footer-value user-id">#{user?.user_id}</p>
        </div>
        <div>
          <p className="footer-label">Tổng tiền</p>
          <p className="footer-price">{renderTotalPrice()}</p>
        </div>
        <div>
          <p className="footer-label">Ghế</p>
          <p className="footer-seats">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
        </div>
        <div>
          <p className="footer-label">SHOW ID</p>
          <p className="footer-show-id">#{showId}</p>
        </div>
        <div className="footer-buttons">
          <button className="back-button">Quay lại</button>
          <button className="proceed-button" onClick={handleProceed}>
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
