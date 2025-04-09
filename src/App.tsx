// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../src/components/AdminDashboard/AdminDashboard';
import MoviesPage from '../src/components/Movie/MoviesPage';
import TheatersPage from '../src/components/TheatersPage/TheatersPage';
import OrdersPage from '../src/components/OrdersPage/OrdersPage';
import './App.css';
import MovieTicket from './components/ticket/ticket';
import Myticket from './components/ticket/myticket';
import ShowsPage from './components/Shows';

import BookingDetail from "./components/seat/BookingDetail.tsx";
import PaymentSuccess from "./components/seat/PaymentSuccess.tsx";
import Register from './components/user/Register.tsx';
import Home from './components/Home/index.tsx';
import MovieDetail from './components/Movie/MovieDetail.tsx';
import Login from './components/user/Login.tsx';
import SeatSelection from './components/seat/SeatSelection.tsx';

const App: React.FC = () => {
  return (
<Router>
     
        <Routes>
          <Route path="/admin/" element={<AdminDashboard />}>
            <Route index element={<MoviesPage />} /> 
            <Route path="movies" element={<MoviesPage />} />
            <Route path="theaters" element={<TheatersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="shows" element={<ShowsPage />} />
          </Route>
          <Route path="/ticket" element={<MovieTicket />}/>
          <Route path="/user" element={<Myticket />} />
          <Route path="/seat" element={<SeatSelection />} />
          <Route path="/booking" element={<BookingDetail />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login/>} />
        </Routes>
    
    </Router>
  );
};

export default App;