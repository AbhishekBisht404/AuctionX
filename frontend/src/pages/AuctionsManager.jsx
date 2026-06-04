import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import api from '../services/api';
import isTokenValid from '../services/tokenvalidity';
import { useNavigate } from 'react-router-dom';

const AuctionsManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex min-w-0 grow flex-col overflow-x-hidden overflow-y-auto bg-[#2C3D73] text-[#FFD372]">
        <Topbar onMenuClick={() => setSidebarOpen((o) => !o)} />
        <div className="box-border p-10">
          <h2 className="mb-2 mt-0 text-2xl font-semibold text-[#FFD372]">Manage Auctions</h2>
          <p className="mb-6 mt-0 text-base leading-[1.6] text-[#7CA8DC]">View, edit, and manage all platform auctions.</p>

          {error && <div className="mb-4 rounded border border-[#F15B42] bg-[rgba(241,91,66,0.2)] px-4 py-3 text-[#FFD372]">{error}</div>}

          {loading ? (
            <p className="m-0 text-[#7CA8DC]">Loading auctions...</p>
          ) : auctions.length === 0 ? (
            <p className="m-0 text-[#7CA8DC]">No auctions found.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Title</th>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Owner</th>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Current Bid</th>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Status</th>
                    <th className="border-b border-[#7CA8DC] p-4 text-left text-sm font-semibold text-[#FFD372]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map((auction) => (
                    <tr key={auction._id}>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]">{auction.title}</td>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]">{auction.owner?.username || '-'}</td>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]">${auction.currentBid}</td>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]"><span className={`inline-block rounded px-2 py-1 text-[0.8rem] capitalize ${auction.status === 'active' ? 'bg-[rgba(255,211,114,0.3)] text-[#2C3D73]' : auction.status === 'ended' ? 'bg-[rgba(124,170,220,0.3)]' : 'bg-[rgba(244,156,196,0.3)]'}`}>{auction.status}</span></td>
                      <td className="border-b border-[#7CA8DC] p-4 text-[#7CA8DC]">
                        <button
                          type="button"
                          className="mb-1 mr-2 rounded border-none bg-[#7CA8DC] px-3 py-1.5 text-[0.85rem] font-medium text-[#2C3D73]"
                          onClick={() => openViewDialog(auction._id)}
                        >
                          View auction
                        </button>
                        <button
                          type="button"
                          className="rounded border-none bg-[#F15B42] px-3 py-1.5 text-[0.85rem] font-medium text-white"
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
        <div className="fixed inset-0 z-[1000] box-border flex items-center justify-center bg-black/50 p-4" onClick={closeViewDialog}>
          <div className="flex max-h-[90vh] w-full max-w-[480px] flex-col rounded-lg border-2 border-[#7CA8DC] bg-[#3d4d80] shadow-[0_8px_32px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#7CA8DC] px-5 py-4">
              <h3 className="m-0 text-[1.1rem] text-[#FFD372]">Auction Details</h3>
              <button type="button" className="cursor-pointer border-none bg-transparent px-1 text-2xl leading-none text-[#7CA8DC]" onClick={closeViewDialog}>×</button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {viewDialogLoading ? (
                <p className="m-0 text-[#7CA8DC]">Loading...</p>
              ) : viewDialogAuction ? (
                <div className="text-[#7CA8DC]">
                  {viewDialogAuction.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img src={`https://auctionx-guan.onrender.com${viewDialogAuction.image}`} alt={viewDialogAuction.title} className="block max-h-[200px] w-full object-cover" />
                    </div>
                  )}
                  <dl className="mb-4">
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372] first:mt-0">Title</dt>
                    <dd className="mt-1 text-[0.95rem]">{viewDialogAuction.title}</dd>
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372]">Description</dt>
                    <dd className="mt-1 text-[0.95rem]">{viewDialogAuction.description || '-'}</dd>
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372]">Owner</dt>
                    <dd className="mt-1 text-[0.95rem]">{viewDialogAuction.owner?.username || '-'} ({viewDialogAuction.owner?.email || '-'})</dd>
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372]">Starting Price</dt>
                    <dd className="mt-1 text-[0.95rem]">${viewDialogAuction.startingPrice}</dd>
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372]">Current Bid</dt>
                    <dd className="mt-1 text-[0.95rem]">${viewDialogAuction.currentBid}</dd>
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372]">Min Increment</dt>
                    <dd className="mt-1 text-[0.95rem]">${viewDialogAuction.minIncrement || 1}</dd>
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372]">Status</dt>
                    <dd className="mt-1 text-[0.95rem]"><span className={`inline-block rounded px-2 py-1 text-[0.8rem] capitalize ${viewDialogAuction.status === 'active' ? 'bg-[rgba(255,211,114,0.3)] text-[#2C3D73]' : viewDialogAuction.status === 'ended' ? 'bg-[rgba(124,170,220,0.3)]' : 'bg-[rgba(244,156,196,0.3)]'}`}>{viewDialogAuction.status}</span></dd>
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372]">Start Time</dt>
                    <dd className="mt-1 text-[0.95rem]">{formatDate(viewDialogAuction.startTime)}</dd>
                    <dt className="mt-3 text-[0.85rem] font-semibold text-[#FFD372]">End Time</dt>
                    <dd className="mt-1 text-[0.95rem]">{formatDate(viewDialogAuction.endTime)}</dd>
                  </dl>
                  <div className="mt-4 border-t border-[rgba(124,170,220,0.3)] pt-4">
                    <button
                      type="button"
                      className="rounded border-none bg-[#F15B42] px-3 py-1.5 text-[0.85rem] font-medium text-white"
                      onClick={() => removeAuction(viewDialogAuction._id)}
                    >
                      Remove auction
                    </button>
                  </div>
                </div>
              ) : (
                <p className="m-0 text-[#7CA8DC]">Could not load auction.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionsManager;
