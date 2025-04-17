import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logoweb.png'
import backtohome from '../../assets/back-to-home.png'
interface Movie {
  movie_id: string;
  movie_name: string;
  path: string;
  description?: string;
  duration: string;
  genre: string;
}

interface Theater {
  theater_id: string;
  theater_name: string;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('28 Oct Sat');
  const [selectedTime, setSelectedTime] = useState<string>('15:40');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dates: string[] = ['22 Oct Mon', '23 Oct Tue', '24 Oct Wed', '25 Oct Thu', '26 Oct Fri', '28 Oct Sat'];
  const times: string[] = ['15:40', '18:30', '20:00'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const movieResponse = await axios.get<Movie>(`https://backendmovie-10gn.onrender.com/api/movies/${id}`);
        setMovie(movieResponse.data);

        const theatersResponse = await axios.get<Theater[]>('https://backendmovie-10gn.onrender.com/api/theaters');
        setTheaters(theatersResponse.data);

        if (theatersResponse.data.length > 0) {
          setSelectedTheater(theatersResponse.data[0].theater_name);
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

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (error) return <div className="text-white p-10">{error}</div>;
  if (!movie) return <div className="text-white p-10">Movie not found</div>;

  const handleProceed = () => {
    navigate('/seat ')
    // fetch('https://jsonplaceholder.typicode.com/posts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     movieId: movie.movie_id,
    //     theater: selectedTheater,
    //     date: selectedDate,
    //     time: selectedTime,
    //   }),
    // })
    //   .then(() => {
    //     navigate('/'); // Navigate to seat selection after booking
    //     alert('Booking saved! Proceeding to seat selection...');
    //   })
    //   .catch((err) => alert('Error: ' + err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/home');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const formatDate = (dateStr: string): string => {
    const [day, month] = dateStr.split(' ');
    const monthMap: { [key: string]: string } = {
      Jan: 'January',
      Feb: 'February',
      Mar: 'March',
      Apr: 'April',
      May: 'May',
      Jun: 'June',
      Jul: 'July',
      Aug: 'August',
      Sep: 'September',
      Oct: 'October',
      Nov: 'November',
      Dec: 'December',
    };
    return `${day} ${monthMap[month]} 2023`;
  };

  return (
    <div className="movie-detail-container">
      <header className="header">
        <div className="logo-section">
          <img className="logo-home" src={logo} alt="Film" />
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </header>
      <button className="back-to-home-button" onClick={handleBackToHome}>
        <img src={backtohome} alt="Back" className="back-icon" />
      </button>
      <div className="movie-detail-content">
        <div className="selection-section">
          <div>
            <h3>THEATER</h3>
            <div className="options">
              {theaters.map((theater) => (
                <button
                  key={theater.theater_id}
                  className={`option-button ${selectedTheater === theater.theater_name ? 'selected' : ''}`}
                  onClick={() => setSelectedTheater(theater.theater_name)}
                >
                  {theater.theater_name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3>DATE</h3>
            <div className="options">
              {dates.map((date) => (
                <button
                  key={date}
                  className={`option-button ${selectedDate === date ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3>TIME</h3>
            <div className="options">
              {times.map((time) => (
                <button
                  key={time}
                  className={`option-button ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="movie-info-section">
          <img src={movie.path} alt={movie.movie_name} className="movie-poster-large" />
          <h2>{movie.movie_name}</h2>
          <p className="movie-description">{movie.description || 'No description available'}</p>
          <div className="movie-details">
            <p>Duration: <span>{movie.duration}</span></p>
            <p>Type: <span>{movie.genre}</span></p>
          </div>
          <div className="booking-summary">
            <h4>{selectedTheater}</h4>
            <p>{formatDate(selectedDate)} {selectedTime}</p>
            <p className="note">*Seat selection can be done after this</p>
            <button className="proceed-button" onClick={handleProceed}>
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;