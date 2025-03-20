import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import ManageUsers from './pages/ManageUsers';
import Sidebar from './pages/Sidebar';
import './styles/Global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addstudent" element={<AddStudent />} />
          <Route path="/manageusers" element={<ManageUsers />} />
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);