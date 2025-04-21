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

  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Failed to load data. Please try again later.');
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
    if (parts?.length < 3) return 'Select a date';
    const [day, month] = parts;
    const monthMap: Record<string, string> = {
      Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April',
      May: 'May', Jun: 'June', Jul: 'July', Aug: 'August',
      Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December'
    };
    return `${day} ${monthMap[month] || month} 2023`;
  };

  const handleProceed = () => {
    const selectedShow = shows.find((show) => {
      const date = new Date(show.show_time);
      return (
        show.theater_id === getTheaterIdByName(selectedTheater) &&
        formatShowDate(date) === selectedDate &&
        formatShowTime(date) === selectedTime
      );
    });

    if (!selectedShow) {
      alert('No matching show found for the selected options.');
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

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleBackToHome = () => navigate('/');

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (error) return <div className="text-white p-10">{error}</div>;
  if (!movie) return <div className="text-white p-10">Movie not found</div>;

  return (
    <div className="movie-detail-container">
      <header className="header">
        <div className="logo-section">
          <img src={logo} alt="Film" className="logo-home" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
        </div>
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </header>
      <button className="back-to-home-button" onClick={handleBackToHome}>
        <img src={bth} alt="Back" className="back-icon" />
      </button>
      <div className="movie-detail-content">
        <div className="selection-section">
          <div>
            <h3>THEATER</h3>
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
            <h3>DATE</h3>
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
              ) : <p>No showtimes available for this theater.</p>}
            </div>
          </div>
          <div>
            <h3>TIME</h3>
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
              ) : <p>No times available for this date.</p>}
            </div>
          </div>
        </div>
        <div className="movie-info-section">
          <img src={movie.path} alt={movie.movie_name} className="movie-poster-large" />
          <h2>{movie.movie_name}</h2>
          <div className="movie-details">
            <p>Duration: <span>{movie.duration}</span></p>
            <p>Type: <span>{movie.genre}</span></p>
          </div>
          <div className="booking-summary">
            <h4>{selectedTheater || 'Select a theater'}</h4>
            <p>{formatDate(selectedDate)} {selectedTime || 'Select a time'}</p>
            <p className="note">*Seat selection can be done after this</p>
            <button
              className="proceed-button"
              onClick={handleProceed}
              disabled={!selectedTheater || !selectedDate || !selectedTime}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
