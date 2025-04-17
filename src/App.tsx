import React, { JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { useAuth } from "./components/hook/AuthenContext.tsx";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const userRole = user?.role || "";

  if (!isLoggedIn || !user || userRole !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
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
