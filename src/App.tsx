// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../src/components/AdminDashboard/AdminDashboard';
import MoviesPage from '../src/components/Movie/MoviesPage';
import TheatersPage from '../src/components/TheatersPage/TheatersPage';
import OrdersPage from '../src/components/OrdersPage/OrdersPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="w-full bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<AdminDashboard />}>
            <Route path="movies" element={<MoviesPage />} />
            <Route path="theaters" element={<TheatersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route index element={<MoviesPage />} /> {/* Default route */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;