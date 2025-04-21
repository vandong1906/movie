import { useEffect } from "react";
import * as React from "react";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/AuthenContext";
import logo from "../../assets/logoweb.png";
interface Movie {
  movie_id: number;
  movie_name: string;
  genre: string;
  duration: string;
  path: string;
}

interface Theater {
  theater_id: number;
  theater_name: string;
  location: string;
}

interface Show {
  show_id: number;
  show_time: string;
  movie_id: number;
  theater_id: number;
  movie: Movie;
  theater: Theater;
}

interface Ticket {
  ticket_id: number;
  orderInfo: string;
  seat_number: string;
  price: string;
  show_id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  payment: string | null;
  show: Show;
}

const MovieTicket = () => {
  const [data1, setdata1] = React.useState<Ticket[] | null>();
  const { user } = useAuth();

  useEffect(() => {
    const respon = async () => {
      const data = await axios.get(
        "https://backendmovie-10gn.onrender.com/api/admins/" + user?.user_id
      );

      const { tickets } = data.data;

      setdata1(tickets);
    };
    respon();
  }, []);
  console.log(data1);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/");
  };

  return (
    <>
      <div className="home-container">
        <div className="header">
          <img
            className="logo-home"
            src={logo}
            alt="Film"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
          <div className="auth-buttons">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/my-ticket")}
                  className="ticket-button"
                >
                  My Ticket
                </button>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </>
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
        <h2 className="section-title">My ticket</h2>
        <div className="movie-grid items-center">
          <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 shadow-lg text-white w-80">
            {data1?.map((ticket) => (
              <div key={ticket.ticket_id} className="mb-4">
                {/* Display Date */}
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-lg font-semibold">
                  {new Date(ticket.show.show_time).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                {/* Display Movie Title */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Movie Title</p>
                  <p className="text-xl font-bold uppercase">
                    {ticket.show.movie.movie_name}
                  </p>
                </div>

                {/* Display Seat Number and Show Time */}
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Seat Number</p>
                    <p className="text-lg font-semibold">
                      {ticket.seat_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Show Time</p>
                    <p className="text-lg font-semibold">
                      {new Date(ticket.show.show_time).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Display Ticket Price */}
                <div className="flex justify-center mb-4">
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-lg font-semibold">{ticket.price} VND</p>
                </div>

                {/* Download Ticket Button */}
                <button className="w-full cursor-pointer bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
                  Download Ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieTicket;
