import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function BidderDashboard() {
  const [joinedAuctions, setJoinedAuctions] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]); // New State
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [joinedRes, wonRes] = await Promise.all([
          api.get('/auctions/joined'),
          api.get('/auctions/won') 
        ]);
        setJoinedAuctions(joinedRes.data);
        setWonAuctions(wonRes.data);
      } catch (err) {
        console.error("Dashboard Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-inner-content">
      {/* SECTION 1: ACTIVE BIDS */}
      <header className="dashboard-header-flex">
        <div>
          <h2 className="dashboard-page__title">Active Bidding</h2>
          <p className="dashboard-page__subtitle">Items you are currently competing for.</p>
        </div>
      </header>

      <div className="dashboard-table-container">
        {joinedAuctions.length === 0 ? (
          <p className="empty-text">No active bids. <Link to="/dashboard/browseMarket">Explore Market</Link></p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Current Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {joinedAuctions.map((item) => (
                <tr key={item._id}>
                  <td className="table-item-cell">
                    <img src={item.image ? `http://localhost:5000${item.image}` : '/placeholder.jpg'} alt="" className="table-thumb" />
                    <span>{item.title}</span>
                  </td>
                  <td>${item.currentBid}</td>
                  <td>
                    <span className={`status-badge ${item.highestBidder === currentUserId ? 'active' : 'ended'}`}>
                      {item.highestBidder === currentUserId ? 'WINNING' : 'OUTBID'}
                    </span>
                  </td>
                  <td><Link to={`/auction/${item._id}`} className="text-link">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SECTION 2: WON AUCTIONS */}
      <header className="dashboard-header-flex" style={{ marginTop: '3rem' }}>
        <div>
          <h2 className="dashboard-page__title">Won Auctions</h2>
          <p className="dashboard-page__subtitle">Items successfully purchased.</p>
        </div>
      </header>

      <div className="dashboard-table-container">
        {wonAuctions.length === 0 ? (
          <p className="empty-text">You haven't won any auctions yet.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Final Price</th>
                <th>Winner Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wonAuctions.map((item) => (
                <tr key={item._id}>
                  <td className="table-item-cell">
                    <img src={`http://localhost:5000${item.image}`} alt="" className="table-thumb" />
                    <span>{item.title}</span>
                  </td>
                  <td>${item.currentBid}</td>
                  <td><span className="status-badge active">PAID / WON</span></td>
                  <td><button className="secondary-btn">Contact Seller</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}