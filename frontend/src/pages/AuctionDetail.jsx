import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Home.css'; 
import './Dashboard.css';

export default function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await api.get(`/auctions/${id}`);
        setAuction(res.data);
      } catch (err) {
        console.error("Failed to fetch auction details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  if (loading) return <div className="loading-screen">Curating details...</div>;
  if (!auction) return <div className="error-screen">Auction not found.</div>;

  return (
    <div className={token ? "dashboard-layout" : "public-site-wrapper"}>
      
      {token ? <Sidebar /> : (
        <nav className="public-nav">
          <div className="nav-container">
            <Link to="/" className="nav-logo">AUCTION<span>X</span></Link>
            <div className="nav-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-btn">Join Now</Link>
            </div>
          </div>
        </nav>
      )}

      <main className={token ? "dashboard-main" : "public-main"}>
        {token && <Topbar title="Auction View" />}

        <div className={token ? "dashboard-canvas" : "public-container"}>
          <div className="detail-wrapper">
            
            <div className="detail-image-box">
              <img 
                src={auction.image ? `http://localhost:5000${auction.image}` : '/placeholder.jpg'} 
                alt={auction.title} 
              />
              <div className="detail-status-tag">{auction.status}</div>
            </div>

            <div className="detail-info-box">
              <span className="seller-label">Seller: @{auction.owner?.username}</span>
              <h1 className="item-title">{auction.title}</h1>
              <p className="item-description">{auction.description}</p>

              <div className="bidding-panel">
                <div className="current-bid-section">
                  <label>Current Bid</label>
                  <div className="big-price">${auction.currentBid.toLocaleString()}</div>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <span>Min. Increment</span>
                    <strong>+${auction.minIncrement}</strong>
                  </div>
                  <div className="info-item">
                    <span>Ends On</span>
                    <strong>{new Date(auction.endTime).toLocaleDateString()}</strong>
                  </div>
                </div>

                <hr className="divider" />

                {token ? (
                  <div className="bid-input-area">
                    <label>Place Your Bid</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        placeholder={`Min. $${auction.currentBid + auction.minIncrement}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="bid-field"
                      />
                      <button className="bid-button">Place Bid</button>
                    </div>
                  </div>
                ) : (
                  <div className="guest-cta-box">
                    <p>Sign in to join the bidding for this item.</p>
                    <Link to="/login" className="bid-button block-btn">Sign In to Bid</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {!token && (
          <footer className="home-footer">
            <div className="footer-container">
              <div className="footer-brand-section">
                <Link to="/" className="brand-logo footer-logo">AUCTION<span>X</span></Link>
                <p className="footer-tagline">The world's premier destination for rare collectibles.</p>
              </div>
              <div className="footer-links-grid">
                <div className="footer-column">
                  <h4>Marketplace</h4>
                  <Link to="/">Explore</Link>
                  <Link to="/register">Sell</Link>
                </div>
                <div className="footer-column">
                  <h4>Support</h4>
                  <Link to="/">Help Center</Link>
                  <Link to="/">Terms</Link>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 AUCTIONX. All Rights Reserved.</p>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}