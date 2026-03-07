import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const [role] = useState(() => localStorage.getItem('role') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/');
  };

  const navItemClass = ({ isActive }) => (isActive ? 'nav-item active' : 'nav-item');

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <h2>AuctionX</h2>
        <span className="role-badge">{role}</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end className={navItemClass}>Overview</NavLink>
        <NavLink to="/dashboard/browseMarket" className={navItemClass}>Browse Market</NavLink>
        {role === 'admin' && (
          <>
            <NavLink to="/dashboard/manageUsers" className={navItemClass}>Manage Users</NavLink>  

       
        <NavLink to="/dashboard/auctionManager" className={navItemClass}>Manage Auctions</NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button type="button" onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </aside>
  );
}
