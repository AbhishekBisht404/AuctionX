import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import './Topbar.css';

const ROUTE_TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/browseMarket': 'Browse Market',
  '/dashboard/auctionManager': 'Manage Auctions',
  '/dashboard/manageUsers': 'Manage Users',
};

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const [username] = useState(() => localStorage.getItem('username') || 'User');
  const title = ROUTE_TITLES[location.pathname] ?? 'Dashboard';

  return (
    <header className="h-16 sm:h-20 bg-blue-900 border-b-2 border-blue-600 flex justify-between items-center px-4 sm:px-6 md:px-10 flex-shrink-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => onMenuClick?.()}
          className="sm:hidden text-yellow-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="m-0 text-xs sm:text-sm md:text-base font-semibold text-blue-300 uppercase tracking-wide">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-xs sm:text-sm font-medium text-yellow-300 truncate">Hi, {username}</span>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">{username.charAt(0).toUpperCase()}</div>
      </div>
    </header>
  );
}
