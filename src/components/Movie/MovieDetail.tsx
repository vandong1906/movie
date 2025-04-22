import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logoweb.png';
import bth from '../../assets/back-to-home.png';

interface Movie {
  movie_id: number;
  movie_name: string;
  duration: string;
  genre: string;
  path: string;
  shows: Show[];
}

interface Show {
  show_id: number;
  movie_id: number;
  theater_id: number;
  show_time: string;
}

interface Theater {
  theater_id: number;
  theater_name: string;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const movieRes = await axios.get<Movie>(`https://backendmovie-10gn.onrender.com/api/movies/${id}`);
        setMovie(movieRes.data);

        const validShows = (movieRes.data.shows || []).filter(
          (show) => show.show_time && show.theater_id && !isNaN(new Date(show.show_time).getTime())
        );
        setShows(validShows);

        const theatersRes = await axios.get<Theater[]>('https://backendmovie-10gn.onrender.com/api/theaters');
        setTheaters(theatersRes.data);

        if (theatersRes.data.length > 0) {
          setSelectedTheater(theatersRes.data[0].theater_name);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không tải được dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatShowDate = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
    return `${day} ${month} ${dayOfWeek}`;
  };

  const formatShowTime = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getUniqueDates = (): string[] => {
    const theaterId = getTheaterIdByName(selectedTheater);
    const dates = new Set(
      shows
        .filter((show) => show.theater_id === theaterId)
        .map((show) => formatShowDate(new Date(show.show_time)))
        .filter((d) => d !== '')
    );
    return Array.from(dates);
  };

  const getUniqueTimes = (): string[] => {
    const theaterId = getTheaterIdByName(selectedTheater);
    const times = new Set(
      shows
        .filter((show) => {
          const date = new Date(show.show_time);
          return (
            show.theater_id === theaterId &&
            formatShowDate(date) === selectedDate
          );
        })
        .map((show) => formatShowTime(new Date(show.show_time)))
        .filter((t) => t !== '')
    );
    return Array.from(times);
  };

  const getTheaterIdByName = (name: string): number | null => {
    const t = theaters.find((th) => th.theater_name === name);
    return t ? t.theater_id : null;
  };

  const formatDate = (dateStr: string): string => {
    const parts = dateStr?.split(' ');
    if (parts?.length < 3) return 'Chọn ngày';
    const [day, month] = parts;
    const monthMap: Record<string, string> = {
      Jan: 'Tháng 1', Feb: 'Tháng 2', Mar: 'Tháng 3', Apr: 'Tháng 4',
      May: 'Tháng 5', Jun: 'Tháng 6', Jul: 'Tháng 7', Aug: 'Tháng 8',
      Sep: 'Tháng 9', Oct: 'Tháng 10', Nov: 'Tháng 11', Dec: 'Tháng 12'
    };
    return `${day} ${monthMap[month] || month} 2023`;
  };

  const handleProceed = () => {
    if (!selectedTheater || !selectedDate || !selectedTime) {
      setNotification('Vui lòng chọn rạp chiếu, ngày và giờ trước khi tiếp tục.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (!isLoggedIn) {
      setIsModalOpen(true);
      return;
    }

    const selectedShow = shows.find((show) => {
      const date = new Date(show.show_time);
      return (
        show.theater_id === getTheaterIdByName(selectedTheater) &&
        formatShowDate(date) === selectedDate &&
        formatShowTime(date) === selectedTime
      );
    });

    if (!selectedShow) {
      setNotification('Không tìm thấy lịch chiếu phù hợp với các tùy chọn đã chọn.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    navigate('/seat', {
      state: {
        movie,
        theaterName: selectedTheater,
        showId: selectedShow.show_id,
        showTime: selectedTime,
        showDate: selectedDate,
      }
    });
  };

  const handleModalConfirm = () => {
    localStorage.setItem('loginMessage', 'Vui lòng đăng nhập để tiếp tục đặt vé.');
    navigate('/login');
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleBackToHome = () => navigate('/');

  const isProceedDisabled = !selectedTheater || !selectedDate || !selectedTime;

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return <div className="error">Không tìm thấy phim</div>;

  return (
    <div className="movie-detail-container">
      <div className="header">
        <img
          className="logo-home"
          src={logo}
          alt="Film"
          onClick={() => navigate('/')}
        />
        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <button className="ticket-button" onClick={() => navigate('/my-ticket')}>
                Vé của tôi
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button className="auth-button" onClick={handleLogin}>
                Đăng nhập
              </button>
              <button className="auth-button" onClick={handleRegister}>
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
      <button className="back-to-home-button" onClick={handleBackToHome}>
        <img src={bth} alt="Back" className="back-icon" />
      </button>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Yêu cầu đăng nhập</h3>
            <p>Bạn cần đăng nhập để tiếp tục đặt vé. Bạn có muốn đăng nhập ngay bây giờ không?</p>
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={handleModalCancel}>
                Từ chối
              </button>
              <button className="modal-button confirm" onClick={handleModalConfirm}>
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="movie-detail-content">
        <div className="selection-section">
          <div>
            <h3>RẠP</h3>
            <div className="options">
              {theaters.map((t) => (
                <button
                  key={t.theater_id}
                  className={`option-button ${selectedTheater === t.theater_name ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedTheater(t.theater_name);
                    setSelectedDate('');
                    setSelectedTime('');
                  }}
                >
                  {t.theater_name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3>NGÀY</h3>
            <div className="options">
              {getUniqueDates().length > 0 ? (
                getUniqueDates().map((date) => (
                  <button
                    key={date}
                    className={`option-button ${selectedDate === date ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime('');
                    }}
                  >
                    {date}
                  </button>
                ))
              ) : (
                <p>Không có lịch chiếu cho rạp này.</p>
              )}
            </div>
          </div>
          <div>
            <h3>GIỜ</h3>
            <div className="options">
              {getUniqueTimes().length > 0 ? (
                getUniqueTimes().map((time) => (
                  <button
                    key={time}
                    className={`option-button ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <p>Vui lòng chọn ngày!</p>
              )}
            </div>
          </div>
        </div>
        <div className="movie-info-section">
          <img src={movie.path} alt={movie.movie_name} className="movie-poster-large" />
          <h2>{movie.movie_name}</h2>
          <div className="movie-details">
            <p>
              Thời lượng: <span>{movie.duration}</span>
            </p>
            <p>
              Thể loại: <span>{movie.genre}</span>
            </p>
          </div>
          <div className="booking-summary">
            <h4>{selectedTheater || 'Chọn rạp chiếu'}</h4>
            <p>
              {formatDate(selectedDate)} {selectedTime || 'Chọn giờ'}
            </p>
            <p className="note">Hãy nhấn "Thanh toán" để chọn ghế</p>
            <button
              className="proceed-button"
              onClick={handleProceed}
              disabled={isProceedDisabled}
              title={isProceedDisabled ? 'Vui lòng chọn rạp chiếu, ngày và giờ' : 'Tiến hành thanh toán'}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;