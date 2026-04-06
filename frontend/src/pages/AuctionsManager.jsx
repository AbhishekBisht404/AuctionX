import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import api from '../services/api';
import './AuctionsManager.css';
import isTokenValid from '../services/tokenvalidity';
import { useNavigate } from 'react-router-dom';

const AuctionsManager = () => {
  const navigate = useNavigate();
    useEffect(() => {
      if (!isTokenValid()) {
        navigate('/');
        return;
      }
    }, []);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewDialogAuction, setViewDialogAuction] = useState(null);
  const [viewDialogLoading, setViewDialogLoading] = useState(false);

  
  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/auctions/admin/all');
      setAuctions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const openViewDialog = async (auctionId) => {
    setViewDialogOpen(true);
    setViewDialogAuction(null);
    setViewDialogLoading(true);
    try {
      const res = await api.get(`/auctions/${auctionId}`);
      setViewDialogAuction(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch auction details');
    } finally {
      setViewDialogLoading(false);
    }
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setViewDialogAuction(null);
  };

  const removeAuction = async (auctionId) => {
   
    try {
      await api.delete(`/auctions/admin/${auctionId}`);
      setAuctions((prev) => prev.filter((a) => a._id !== auctionId));
      if (viewDialogAuction?._id === auctionId) closeViewDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove auction');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="auctions-manager-layout">
      <Sidebar />
      <main className="auctions-manager-main">
        <Topbar />
        <div className="auctions-manager-canvas">
          <h2>Manage Auctions</h2>
          <p>View, edit, and manage all platform auctions.</p>

          {error && <div className="auctions-manager-error">{error}</div>}

          {loading ? (
            <p className="auctions-manager-loading">Loading auctions...</p>
          ) : auctions.length === 0 ? (
            <p className="auctions-manager-empty">No auctions found.</p>
          ) : (
            <div className="auctions-manager-table-wrap">
              <table className="auctions-manager-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Current Bid</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map((auction) => (
                    <tr key={auction._id}>
                      <td>{auction.title}</td>
                      <td>{auction.owner?.username || '-'}</td>
                      <td>${auction.currentBid}</td>
                      <td><span className={`auctions-manager-status auctions-manager-status-${auction.status}`}>{auction.status}</span></td>
                      <td>
                        <button
                          type="button"
                          className="auctions-manager-btn auctions-manager-btn-view"
                          onClick={() => openViewDialog(auction._id)}
                        >
                          View auction
                        </button>
                        <button
                          type="button"
                          className="auctions-manager-btn-remove"
                          onClick={() => removeAuction(auction._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {viewDialogOpen && (
        <div className="auctions-manager-dialog-overlay" onClick={closeViewDialog}>
          <div className="auctions-manager-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="auctions-manager-dialog-header">
              <h3>Auction Details</h3>
              <button type="button" className="auctions-manager-dialog-close" onClick={closeViewDialog}>×</button>
            </div>
            <div className="auctions-manager-dialog-body">
              {viewDialogLoading ? (
                <p className="auctions-manager-dialog-loading">Loading...</p>
              ) : viewDialogAuction ? (
                <div className="auctions-manager-dialog-content">
                  {viewDialogAuction.image && (
                    <div className="auctions-manager-dialog-image">
                      <img src={`http://localhost:5000${viewDialogAuction.image}`} alt={viewDialogAuction.title} />
                    </div>
                  )}
                  <dl className="auctions-manager-dialog-dl">
                    <dt>Title</dt>
                    <dd>{viewDialogAuction.title}</dd>
                    <dt>Description</dt>
                    <dd>{viewDialogAuction.description || '-'}</dd>
                    <dt>Owner</dt>
                    <dd>{viewDialogAuction.owner?.username || '-'} ({viewDialogAuction.owner?.email || '-'})</dd>
                    <dt>Starting Price</dt>
                    <dd>${viewDialogAuction.startingPrice}</dd>
                    <dt>Current Bid</dt>
                    <dd>${viewDialogAuction.currentBid}</dd>
                    <dt>Min Increment</dt>
                    <dd>${viewDialogAuction.minIncrement || 1}</dd>
                    <dt>Status</dt>
                    <dd><span className={`auctions-manager-status auctions-manager-status-${viewDialogAuction.status}`}>{viewDialogAuction.status}</span></dd>
                    <dt>Start Time</dt>
                    <dd>{formatDate(viewDialogAuction.startTime)}</dd>
                    <dt>End Time</dt>
                    <dd>{formatDate(viewDialogAuction.endTime)}</dd>
                  </dl>
                  <div className="auctions-manager-dialog-actions">
                    <button
                      type="button"
                      className="auctions-manager-btn-remove"
                      onClick={() => removeAuction(viewDialogAuction._id)}
                    >
                      Remove auction
                    </button>
                  </div>
                </div>
              ) : (
                <p className="auctions-manager-dialog-empty">Could not load auction.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionsManager;
