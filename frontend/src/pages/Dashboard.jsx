import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ role: null, username: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username') || 'User';
    
    setUser({ role: storedRole, username: storedUsername });
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (isLoading) {
    return <div className="dashboard-loading">Loading workspace...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR - Now Light and Clean */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>AuctionX</h2>
          <span className="role-badge">{user.role}</span>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">Overview</Link>
          <Link to="/" className="nav-item">Browse Market</Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-topbar">
          <h1 className="topbar-title">Dashboard</h1>
          <div className="topbar-user">
            <span className="user-greeting">Hi, {user.username}</span>
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        {/* WORKSPACE */}
        <div className="dashboard-canvas">
          {user.role === 'seller' && <SellerDashboard />}
          {user.role === 'bidder' && <BidderDashboard />}
          {user.role === 'admin' && <AdminDashboard />}
        </div>
      </main>
    </div>
  );
}

/* =========================================
   SELLER DASHBOARD
   ========================================= */
function SellerDashboard() {
  const [activeListings, setActiveListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get('/auctions/my-listings');
        setActiveListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="dashboard-stack">
      <div className="dashboard-card">
        <div className="card-header flex-between">
          <h3>My Active Listings</h3>
          {/* Button moved here! */}
          <Link to="/create-auction" className="primary-btn">
            + New Auction
          </Link>
        </div>
        
        {loading ? (
          <p className="state-text">Loading your listings...</p>
        ) : activeListings.length === 0 ? (
          <div className="empty-state">
            <p>You have no active listings.</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Title</th>
                  <th>Current Bid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeListings.map(auction => (
                  <tr key={auction._id}>
                    <td className="font-medium">{auction.title}</td>
                    <td>${auction.currentBid}</td>
                    <td><span className="status-badge active">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================
   BIDDER DASHBOARD
   ========================================= */
function BidderDashboard() {
  const [activeBids, setActiveBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBidderData = async () => {
      try {
        const [bidsRes, wonRes] = await Promise.all([
          api.get('/bids/my-bids'),
          api.get('/auctions/won')
        ]);
        setActiveBids(bidsRes.data);
        setWonAuctions(wonRes.data);
      } catch (error) {
        console.error("Failed to fetch bidder data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBidderData();
  }, []);

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Active Bids</h3>
        </div>
        {loading ? (
          <p className="state-text">Loading bids...</p>
        ) : activeBids.length === 0 ? (
          <p className="state-text">Not participating in any active auctions.</p>
        ) : (
          <ul className="clean-list">
            {activeBids.map(bid => (
              <li key={bid._id}>
                <span>{bid.auction?.title}</span>
                <strong>${bid.amount}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h3>Auctions Won</h3>
        </div>
        {loading ? (
          <p className="state-text">Loading wins...</p>
        ) : wonAuctions.length === 0 ? (
          <p className="state-text">No wins yet. Keep bidding!</p>
        ) : (
          <ul className="clean-list">
            {wonAuctions.map(auction => (
              <li key={auction._id}>
                <span>{auction.title}</span>
                <span className="status-badge won">Pay ${auction.currentBid}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* =========================================
   ADMIN DASHBOARD
   ========================================= */
function AdminDashboard() {
  return (
    <div className="dashboard-stack">
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Platform Overview</h3>
        </div>
        <p className="state-text">Admin metrics loading...</p>
      </div>
    </div>
  );
}