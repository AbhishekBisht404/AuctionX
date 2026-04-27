import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import api from '../services/api';

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
    <div className="flex h-screen w-screen overflow-hidden max-[600px]:flex-col">
      <Sidebar />
      <main className="flex grow flex-col overflow-x-hidden overflow-y-auto bg-[#2C3D73] text-[#FFD372]">
        <Topbar />
        <div className="box-border p-10">
          <h2 className="mb-2 mt-0 text-2xl font-semibold text-[#FFD372]">Manage Users</h2>
          <p className="mb-6 mt-0 text-base leading-[1.6] text-[#7CA8DC]">View and manage user accounts and roles.</p>

          {error && <div className="mb-4 rounded border border-[#F15B42] bg-[rgba(241,91,66,0.2)] px-4 py-3 text-[#FFD372]">{error}</div>}

          {loading ? (
            <p className="m-0 text-[#7CA8DC]">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="m-0 text-[#7CA8DC]">No users found.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Username</th>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Email</th>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Role</th>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]">{user.username}</td>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]">{user.email}</td>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]"><span className="rounded bg-[rgba(124,170,220,0.2)] px-2 py-1 capitalize">{user.role}</span></td>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]">
                        {user.role !== 'admin' && (
                          <>
                            {user.role === 'bidder' ? (
                              <button
                                type="button"
                                className="mb-1 mr-2 rounded border-none bg-[#7CA8DC] px-3 py-1.5 text-[0.85rem] font-medium text-[#2C3D73]"
                                onClick={() => openBidsDialog(user)}
                              >
                                View Bids
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="mb-1 mr-2 rounded border-none bg-[#7CA8DC] px-3 py-1.5 text-[0.85rem] font-medium text-[#2C3D73]"
                                onClick={() => openAuctionsDialog(user)}
                              >
                                View Auctions
                              </button>
                            )}
                            <button
                              type="button"
                              className="rounded border-none bg-[#F15B42] px-3 py-1.5 text-[0.85rem] font-medium text-white"
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
        <div className="fixed inset-0 z-[1000] box-border flex items-center justify-center bg-black/50 p-4" onClick={closeDialog}>
          <div className="flex max-h-[80vh] w-full max-w-[560px] flex-col rounded-lg border-2 border-[#7CA8DC] bg-[#3d4d80] shadow-[0_8px_32px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#7CA8DC] px-5 py-4">
              <h3>
                {dialogType === 'bids' ? `Bids by ${dialogUser?.username}` : `Auctions by ${dialogUser?.username}`}
              </h3>
              <button type="button" className="cursor-pointer border-none bg-transparent px-1 text-2xl leading-none text-[#7CA8DC]" onClick={closeDialog}>×</button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {loadingDialog ? (
                <p className="m-0 text-[#7CA8DC]">Loading...</p>
              ) : dialogData.length === 0 ? (
                <p className="m-0 text-[#7CA8DC]">
                  {dialogType === 'bids' ? 'No bids.' : 'No auctions.'}
                </p>
              ) : (
                <ul className="m-0 list-none p-0">
                  {dialogType === 'bids'
                    ? dialogData.map((bid) => (
                        <li key={bid._id} className="flex flex-wrap items-center gap-3 border-b border-[rgba(124,170,220,0.3)] py-3 text-[#7CA8DC] last:border-none">
                          <span className="min-w-[120px] flex-1 font-medium text-[#FFD372]">{bid.auction?.title || 'Auction'}</span>
                          <span>${bid.amount}</span>
                          <span className="text-[0.8rem] capitalize">{bid.auction?.status || '-'}</span>
                          <div className="ml-auto flex gap-2">
                            {getAuctionId(bid) && (
                              <Link
                                to={`/auction/${getAuctionId(bid)}`}
                                className="inline-block rounded bg-[#7CA8DC] px-2.5 py-1.5 text-[0.8rem] text-[#2C3D73] no-underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View auction
                              </Link>
                            )}
                            <button
                              type="button"
                              className="cursor-pointer rounded border-none bg-[#F15B42] px-2 py-1 text-xs text-white"
                              onClick={() => removeBid(bid._id)}
                            >
                              Remove bid
                            </button>
                          </div>
                        </li>
                      ))
                    : dialogData.map((auction) => (
                        <li key={auction._id} className="flex flex-wrap items-center gap-3 border-b border-[rgba(124,170,220,0.3)] py-3 text-[#7CA8DC] last:border-none">
                          <span className="min-w-[120px] flex-1 font-medium text-[#FFD372]">{auction.title}</span>
                          <span>${auction.currentBid}</span>
                          <span className="text-[0.8rem] capitalize">{auction.status}</span>
                          <div className="ml-auto flex gap-2">
                            <Link
                              to={`/auction/${auction._id}`}
                              className="inline-block rounded bg-[#7CA8DC] px-2.5 py-1.5 text-[0.8rem] text-[#2C3D73] no-underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View auction
                            </Link>
                            <button
                              type="button"
                              className="cursor-pointer rounded border-none bg-[#F15B42] px-2 py-1 text-xs text-white"
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
