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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/');
      return;
    }
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username') || 'User';

    setUser({ role: storedRole, username: storedUsername });
    
   
    if (storedRole === 'admin') {
      navigate('/dashboard/manageUsers');
    }
    
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-blue-300 text-base">Loading workspace...</div>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-blue-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex min-w-0 flex-col flex-grow overflow-y-auto bg-blue-800 text-yellow-300">
        <Topbar onMenuClick={() => setSidebarOpen((o) => !o)} />

        <div className="p-4 sm:p-6 md:p-10 w-full">
          {user.role === 'seller' && <SellerDashboard />}
          {user.role === 'bidder' && <BidderDashboard />}
          {user.role === 'admin' && <AdminDashboard />}
        </div>
      </main>
    </div>
  );
}
