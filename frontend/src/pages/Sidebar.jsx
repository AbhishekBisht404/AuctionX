import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [role] = useState(() => localStorage.getItem('role') || '');

  const closeMobile = () => {
    if (typeof setSidebarOpen === 'function') {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/');
  };

  const navItemClass = ({ isActive }) => 
    isActive 
      ? 'px-4 py-3 sm:px-6 text-yellow-300 font-semibold border-l-4 border-yellow-300 bg-blue-900/40 transition-colors'
      : 'px-4 py-3 sm:px-6 text-blue-300 hover:text-yellow-300 border-l-4 border-transparent transition-colors';

  const sidebarContent = (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-600">
        <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 m-0">AuctionX</h2>
        <span className="inline-block mt-2 bg-blue-900 text-cyan-400 px-2 py-1 rounded text-xs uppercase font-semibold">{role}</span>
      </div>

      <nav className="flex flex-col flex-grow py-4 sm:py-6">
        {role !== 'admin' && (
          <NavLink to="/dashboard" end className={navItemClass} onClick={closeMobile}>Overview</NavLink>
        )}
        <NavLink to="/dashboard/browseMarket" className={navItemClass} onClick={closeMobile}>Browse Market</NavLink>
        {role === 'admin' && (
          <>
            <NavLink to="/dashboard/manageUsers" className={navItemClass} onClick={closeMobile}>Manage Users</NavLink>
            <NavLink to="/dashboard/auctionManager" className={navItemClass} onClick={closeMobile}>Manage Auctions</NavLink>
          </>
        )}
      </nav>

      <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-blue-600">
        <button 
          type="button" 
          onClick={() => { closeMobile(); handleLogout(); }} 
          className="w-full px-4 py-2 sm:py-3 bg-transparent text-blue-300 hover:text-yellow-300 border border-blue-300 hover:border-yellow-300 rounded font-medium text-sm sm:text-base transition-colors"
        >
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex sm:flex-col sm:w-64 md:w-72 bg-blue-900 border-r border-blue-600">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 sm:hidden z-40"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-blue-900 border-r border-blue-600 transform transition-transform duration-300 sm:hidden z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}
