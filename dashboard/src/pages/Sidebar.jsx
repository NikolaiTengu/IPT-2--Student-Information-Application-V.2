import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link">
            <HomeIcon className="sidebar-icon" />
            <span>HOME</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/addstudent" className="sidebar-link">
            <PersonAddIcon className="sidebar-icon" />
            <span>STUDENT</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/manageusers" className="sidebar-link">
            <PersonAddIcon className="sidebar-icon" />
            <span>MANAGE USERS</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;