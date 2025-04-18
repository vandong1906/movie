import { useEffect} from "react";
import * as React from "react";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/AuthenContext";
import logo from "../../assets/logoweb.png";
interface ticket {
  ticket_id: number;
  orderInfo: number;
  seat_number: string;
  price: number;
}
const MovieTicket = () => {
  const [data1, setdata1] = React.useState<ticket[] | null>();
  const { user } = useAuth();
  useEffect(() => {
    const respon = async () => {
      const data = await axios.get(
        "https://backendmovie-10gn.onrender.com/api/admins/" +user?.user_id
      );
console.log(data);
      const { tickets } = data.data;

      setdata1(tickets);
    };
    respon();
  }, []);

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
  console.log(data1);
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
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-lg font-semibold">Mon, 23 Oct 2023</p>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Movie Title</p>
                    <p className="text-xl font-bold uppercase">
                      Spider-Man: No Way Home
                    </p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Ticket(s)</p>
                      <p className="text-lg font-semibold">C8, C9, C10</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Hours</p>
                      <p className="text-lg font-semibold">14:40</p>
                    </div>
                  </div>
                  {/* <div className="flex justify-center mb-4">
                    <p className="text-xl font-bold uppercase"> {ticket.price}</p>
                  </div> */}
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
