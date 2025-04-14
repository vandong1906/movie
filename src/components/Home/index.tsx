import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Movie {
  movie_id: string;
  movie_name: string;
  path: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn: boolean = localStorage.getItem('isLoggedIn') === 'true';
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieClick = (movieId: string) => {
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

  console.log('Movies:', movies);

  return (
    <div className="home-container">
      <div className="header">
        <img className="logo-home" src="/images/logoweb.png" alt="Film" />
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-button">
              Log Out
            </button>
          ) : (
            <>
              <button onClick={handleLogin} className="auth-button">
                Log In
              </button>
              <button onClick={handleRegister} className="auth-button">
                Register
              </button>
            </>
          )}
        </div>
      </div>
      <h2 className="section-title">Now Showing</h2>
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