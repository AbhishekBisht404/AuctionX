import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from './Sidebar'; 
import Topbar from './Topbar';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import './BrowseMarket.css';
import isTokenValid from '../services/tokenvalidity';
import { useNavigate } from 'react-router-dom';

export default function BrowseMarket() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate=useNavigate();

  useEffect(() => {

    if(!isTokenValid()){
navigate('/');
return;
    }


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
    <div className="dashboard-layout">
      <Sidebar /> 
      <main className="dashboard-main">
        <Topbar title="Browse Marketplace" />
        
        <div className="dashboard-canvas">
          <header className="market-header">
            <h2 className="dashboard-page__title">Live Auctions</h2>
            <p className="dashboard-page__subtitle">Items available for bidding right now.</p>
          </header>

          {loading ? (
            <p className="state-text">Loading...</p>
          ) : (
            <div className="market-grid">
              {auctions.map((item) => (
                <Link to={`/auction/${item._id}`} key={item._id} className="item-card">
                  <div className="item-image-wrapper">
                    <img src={item.image ? `http://localhost:5000${item.image}` : '/placeholder.jpg'} alt={item.title} />
                  </div>
                  <div className="item-info">
                    <span className="item-seller">By {item.owner?.username}</span>
                    <h3 className="item-title">{item.title}</h3>
                    <div className="item-footer">
                      <span className="price-amount">${item.currentBid}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}