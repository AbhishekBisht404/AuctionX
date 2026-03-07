import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './SellerDashboard.css';

export default function SellerDashboard() {
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
