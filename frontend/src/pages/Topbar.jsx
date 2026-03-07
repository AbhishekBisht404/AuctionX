import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Topbar.css';

const ROUTE_TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/browseMarket': 'Browse Market',
  '/dashboard/auctionManager': 'Manage Auctions',
  '/dashboard/manageUsers': 'Manage Users',
};

export default function Topbar() {
  const location = useLocation();
  const [username] = useState(() => localStorage.getItem('username') || 'User');
  const title = ROUTE_TITLES[location.pathname] ?? 'Dashboard';

  return (
    <header className="dashboard-topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-user">
        <span className="user-greeting">Hi, {username}</span>
        <div className="avatar">{username.charAt(0).toUpperCase()}</div>
      </div>
    </header>
  );
}
