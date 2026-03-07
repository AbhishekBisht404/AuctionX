import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Home.css';

export default function Home() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await api.get('/auctions/all');
        setAuctions(res.data);
      } catch (err) {
        console.error("Market fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, []);

  return (
    <div className="home-wrapper">
      <nav className="home-nav">
        <div className="nav-inner">
          <Link to="/" className="brand-logo">AUCTION<span>X</span></Link>
          <div className="nav-actions">
            <Link to="/login" className="text-link">Sign In</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <header className="hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-tag">Live & Exclusive</span>
            <h1>Discover & Bid on <br/>Unique Antiques.</h1>
            <p>The world's premier destination for rare collectibles and historical pieces.</p>
            <div className="hero-btns">
              <a href="#explore" className="btn-primary">Explore Market</a>
              <Link to="/register" className="btn-outline">Start Selling</Link>
            </div>
          </div>
        </div>
      </header>

      <main id="explore" className="market-section">
        <div className="section-header">
          <h2>Latest Opportunities</h2>
          <div className="filter-hint">Updated just now</div>
        </div>

        {loading ? (
          <div className="loading-state">Curating collection...</div>
        ) : auctions.length === 0 ? (
          <div className="empty-state">No active auctions at the moment.</div>
        ) : (
          <div className="market-grid">
            {auctions.map((item) => (
              <Link to={`/auction/${item._id}`} key={item._id} className="auction-card">
                <div className="card-media">
                  <img 
                    src={item.image ? `http://localhost:5000${item.image}` : '/placeholder.jpg'} 
                    alt={item.title} 
                  />
                  <div className="time-left">Ending Soon</div>
                </div>
                <div className="card-body">
                  <span className="seller-name">@{item.owner?.username || 'Curator'}</span>
                  <h3>{item.title}</h3>
                  <div className="card-footer">
                    <div className="price-tag">
                      <label>Current Bid</label>
                      <span className="amount">${item.currentBid.toLocaleString()}</span>
                    </div>
                    <div className="bid-action">View Item</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="home-footer">
  <div className="footer-container">
    <div className="footer-brand-section">
      <Link to="/" className="brand-logo footer-logo">AUCTION<span>X</span></Link>
      <p className="footer-tagline">
        The premier destination for discovering and bidding on extraordinary items.
      </p>
    </div>

    <div className="footer-links-grid">
      <div className="footer-column">
        <h4>Marketplace</h4>
        <Link to="/">Explore Auctions</Link>
        <Link to="/register">Become a Seller</Link>
        <Link to="/login">Buyer Protection</Link>
      </div>

      <div className="footer-column">
        <h4>Support</h4>
        <Link to="/">Help Center</Link>
        <Link to="/">Terms of Service</Link>
        <Link to="/">Privacy Policy</Link>
      </div>

      <div className="footer-column">
        <h4>Connect</h4>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
      </div>
    </div>
  </div>
  
  <div className="footer-bottom">
    <p>&copy; 2026 AUCTIONX. Designed for the Extraordinary.</p>
  </div>
</footer>
    </div>
  );
}