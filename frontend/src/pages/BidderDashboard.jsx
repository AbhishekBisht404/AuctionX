import { useState, useEffect } from 'react';
import api from '../services/api';
import './BidderDashboard.css';

export default function BidderDashboard() {
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
                <span>${bid.amount}</span>
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
