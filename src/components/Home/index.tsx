import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logoweb.png';

// Define interface for Movie
interface Movie {
  movie_id: number;
  movie_name: string;
  path: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<Movie[]>('https://backendmovie-10gn.onrender.com/api/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="home-container">
      <div className="header">
        <img
          className="logo-home"
          src={logo}
          alt="Film"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate('/my-ticket')} className="ticket-button">
                Vé của tôi
              </button>
              <button onClick={handleLogout} className="logout-button">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button onClick={handleLogin} className="auth-button">
                Đăng nhập
              </button>
              <button onClick={handleRegister} className="auth-button">
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
      <h2 className="section-title">Đang chiếu</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie.movie_id}
            className="movie-card"
            onClick={() => handleMovieClick(movie.movie_id)}
          >
            <img src={movie.path} alt={movie.movie_name} className="movie-poster" />
            <h3 className="movie-title">{movie.movie_name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;