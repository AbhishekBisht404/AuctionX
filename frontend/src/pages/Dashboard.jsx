import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import isTokenValid from '../services/tokenvalidity';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import SellerDashboard from './SellerDashboard';
import BidderDashboard from './BidderDashboard';
import AdminDashboard from './AdminDashboard';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ role: null, username: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/');
      return;
    }
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username') || 'User';

    setUser({ role: storedRole, username: storedUsername });
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div className="dashboard-loading">Loading workspace...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Topbar />

        <div className="dashboard-canvas">
          {user.role === 'seller' && <SellerDashboard />}
          {user.role === 'bidder' && <BidderDashboard />}
          {user.role === 'admin' && <AdminDashboard />}
        </div>
      </main>
    </div>
  );
}
