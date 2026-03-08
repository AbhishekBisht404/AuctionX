import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import api from '../services/api';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogUser, setDialogUser] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [dialogData, setDialogData] = useState([]);
  const [loadingDialog, setLoadingDialog] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/users/admin/all');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openBidsDialog = async (user) => {
    setDialogUser(user);
    setDialogType('bids');
    setDialogOpen(true);
    setDialogData([]);
    try {
      setLoadingDialog(true);
      const res = await api.get(`/bids/admin/${user._id}`);
      setDialogData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bids');
    } finally {
      setLoadingDialog(false);
    }
  };

  const openAuctionsDialog = async (user) => {
    setDialogUser(user);
    setDialogType('auctions');
    setDialogOpen(true);
    setDialogData([]);
    try {
      setLoadingDialog(true);
      const res = await api.get(`/users/admin/${user._id}/auctions`);
      setDialogData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch auctions');
    } finally {
      setLoadingDialog(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogUser(null);
    setDialogType(null);
    setDialogData([]);
  };

  const removeBid = async (bidId) => {
    if (!window.confirm('Remove this bid?')) return;
    try {
      await api.delete(`/bids/admin/${bidId}`);
      setDialogData((prev) => prev.filter((b) => b._id !== bidId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove bid');
    }
  };

  const removeAuction = async (auctionId) => {
    if (!window.confirm('Remove this auction? All associated bids will be deleted.')) return;
    try {
      await api.delete(`/auctions/admin/${auctionId}`);
      setDialogData((prev) => prev.filter((a) => a._id !== auctionId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove auction');
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm('Remove this user? All their auctions and bids will be deleted. This cannot be undone.')) return;
    try {
      await api.delete(`/users/admin/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      closeDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove user');
    }
  };

  const getAuctionId = (item) => {
    if (dialogType === 'bids') return item.auction?._id || item.auction;
    return item._id;
  };

  return (
    <div className="manage-users-layout">
      <Sidebar />
      <main className="manage-users-main">
        <Topbar />
        <div className="manage-users-canvas">
          <h2>Manage Users</h2>
          <p>View and manage user accounts and roles.</p>

          {error && <div className="manage-users-error">{error}</div>}

          {loading ? (
            <p className="manage-users-loading">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="manage-users-empty">No users found.</p>
          ) : (
            <div className="manage-users-table-wrap">
              <table className="manage-users-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td><span className="manage-users-role">{user.role}</span></td>
                      <td>
                        {user.role !== 'admin' && (
                          <>
                            {user.role === 'bidder' ? (
                              <button
                                type="button"
                                className="manage-users-btn manage-users-btn-view"
                                onClick={() => openBidsDialog(user)}
                              >
                                View Bids
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="manage-users-btn manage-users-btn-view"
                                onClick={() => openAuctionsDialog(user)}
                              >
                                View Auctions
                              </button>
                            )}
                            <button
                              type="button"
                              className="manage-users-btn manage-users-btn-remove"
                              onClick={() => removeUser(user._id)}
                            >
                              Remove User
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {dialogOpen && (
        <div className="manage-users-dialog-overlay" onClick={closeDialog}>
          <div className="manage-users-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="manage-users-dialog-header">
              <h3>
                {dialogType === 'bids' ? `Bids by ${dialogUser?.username}` : `Auctions by ${dialogUser?.username}`}
              </h3>
              <button type="button" className="manage-users-dialog-close" onClick={closeDialog}>×</button>
            </div>
            <div className="manage-users-dialog-body">
              {loadingDialog ? (
                <p className="manage-users-dialog-loading">Loading...</p>
              ) : dialogData.length === 0 ? (
                <p className="manage-users-dialog-empty">
                  {dialogType === 'bids' ? 'No bids.' : 'No auctions.'}
                </p>
              ) : (
                <ul className="manage-users-dialog-list">
                  {dialogType === 'bids'
                    ? dialogData.map((bid) => (
                        <li key={bid._id} className="manage-users-dialog-item">
                          <span className="manage-users-dialog-item-title">{bid.auction?.title || 'Auction'}</span>
                          <span>${bid.amount}</span>
                          <span className="manage-users-status">{bid.auction?.status || '-'}</span>
                          <div className="manage-users-dialog-actions">
                            {getAuctionId(bid) && (
                              <Link
                                to={`/auction/${getAuctionId(bid)}`}
                                className="manage-users-btn manage-users-btn-view-link"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View auction
                              </Link>
                            )}
                            <button
                              type="button"
                              className="manage-users-btn manage-users-btn-remove-small"
                              onClick={() => removeBid(bid._id)}
                            >
                              Remove bid
                            </button>
                          </div>
                        </li>
                      ))
                    : dialogData.map((auction) => (
                        <li key={auction._id} className="manage-users-dialog-item">
                          <span className="manage-users-dialog-item-title">{auction.title}</span>
                          <span>${auction.currentBid}</span>
                          <span className="manage-users-status">{auction.status}</span>
                          <div className="manage-users-dialog-actions">
                            <Link
                              to={`/auction/${auction._id}`}
                              className="manage-users-btn manage-users-btn-view-link"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View auction
                            </Link>
                            <button
                              type="button"
                              className="manage-users-btn manage-users-btn-remove-small"
                              onClick={() => removeAuction(auction._id)}
                            >
                              Remove auction
                            </button>
                          </div>
                        </li>
                      ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
