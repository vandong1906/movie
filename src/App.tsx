// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../src/components/AdminDashboard/AdminDashboard";
import MoviesPage from "../src/components/Movie/MoviesPage";
import TheatersPage from "../src/components/TheatersPage/TheatersPage";
import "./App.css";
import MovieTicket from "./components/ticket/ticket";
import Myticket from "./components/ticket/myticket";
import BookingDetail from "./components/seat/BookingDetail.tsx";
import PaymentSuccess from "./components/seat/PaymentSuccess.tsx";
import Register from "./components/user/Register.tsx";
import Home from "./components/Home/index.tsx";
import MovieDetail from "./components/Movie/MovieDetail.tsx";
import Login from "./components/user/Login.tsx";
import SeatSelection from "./components/seat/SeatSelection.tsx";
import AdminShows from "./components/Shows";
import AdminTickets from "./components/ticketAdmin/TicketAdmin.tsx";

// interface User {
 
//   user_id?: string;
//   User_name?: string;
//   role?:string
// }
const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const userRole="admin";
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     console.log(JSON.parse(storedUser) )
  //     setUser(JSON.parse(storedUser) as User);
  //   } else {
  //     setUser(null);
  //   }
  // }, []); 
  // const userRole = User ? User.role : '';
  return (
    <Router>
      <Routes>
        <Route path="/admin/"  element={
            isLoggedIn && userRole === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          } >
          <Route index element={<MoviesPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="theaters" element={<TheatersPage />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="shows" element={<AdminShows />} />
        </Route>
        <Route path="/ticket" element={<MovieTicket />} />
        <Route path="/user" element={<Myticket />} />
        <Route path="/seat" element={<SeatSelection />} />
        <Route path="/booking" element={<BookingDetail />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
