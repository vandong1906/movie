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

const App: React.FC = () => {
  return (
<Router>
      <div className="w-full bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<AdminDashboard />}>
            <Route index element={<MoviesPage />} /> 
            <Route path="movies" element={<MoviesPage />} />
            <Route path="theaters" element={<TheatersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="shows" element={<ShowsPage />} />
          </Route>
          <Route path="/ticket" element={<MovieTicket />}/>
          <Route path="/user" element={<Myticket />} />
      
        </Routes>
      </div>
    </Router>
  );
};

export default App;