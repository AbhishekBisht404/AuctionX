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
    <div className="p-8 bg-blue-900 text-yellow-300 min-h-screen">
      {/* SECTION 1: ACTIVE BIDS */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-yellow-300">Active Bidding</h2>
          <p className="text-lg text-blue-300 mt-2">Items you are currently competing for.</p>
        </div>
      </header>

      <div className="bg-gray-600 rounded-lg p-6 shadow-lg overflow-x-auto">
        {joinedAuctions.length === 0 ? (
          <p className="text-center text-blue-300 text-xl py-8">No active bids. <Link to="/dashboard/browseMarket" className="text-yellow-300 hover:text-white underline transition-colors">Explore Market</Link></p>
        ) : (
          <table className="w-full text-yellow-300">
            <thead>
              <tr>
                <th className="bg-blue-500 text-yellow-300 p-4 text-left font-semibold border-b-2 border-blue-300">Item</th>
                <th className="bg-blue-500 text-yellow-300 p-4 text-left font-semibold border-b-2 border-blue-300">Current Price</th>
                <th className="bg-blue-500 text-yellow-300 p-4 text-left font-semibold border-b-2 border-blue-300">Status</th>
                <th className="bg-blue-500 text-yellow-300 p-4 text-left font-semibold border-b-2 border-blue-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {joinedAuctions.map((item) => (
                <tr key={item._id}>
                  <td className="p-4 border-b border-blue-300 align-middle flex items-center gap-4">
                    <img src={item.image ? `https://auctionx-guan.onrender.com${item.image}` : '/placeholder.jpg'} alt="" className="w-12 h-12 object-cover rounded border border-blue-300" />
                    <span>{item.title}</span>
                  </td>
                  <td className="p-4 border-b border-blue-300 align-middle">${item.currentBid}</td>
                  <td className="p-4 border-b border-blue-300 align-middle">
                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wide ${item.highestBidder === currentUserId ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {item.highestBidder === currentUserId ? 'WINNING' : 'OUTBID'}
                    </span>
                  </td>
                  <td className="p-4 border-b border-blue-300 align-middle"><Link to={`/auction/${item._id}`} className="text-yellow-300 hover:text-white underline transition-colors">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SECTION 2: WON AUCTIONS */}
      <header className="flex justify-between items-center mb-6 mt-12">
        <div>
          <h2 className="text-3xl font-bold text-yellow-300">Won Auctions</h2>
          <p className="text-lg text-blue-300 mt-2">Items successfully purchased.</p>
        </div>
      </header>

      <div className="bg-gray-600 rounded-lg p-6 shadow-lg overflow-x-auto">
        {wonAuctions.length === 0 ? (
          <p className="text-center text-blue-300 text-xl py-8">You haven't won any auctions yet.</p>
        ) : (
          <table className="w-full text-yellow-300">
            <thead>
              <tr>
                <th className="bg-blue-500 text-yellow-300 p-4 text-left font-semibold border-b-2 border-blue-300">Item</th>
                <th className="bg-blue-500 text-yellow-300 p-4 text-left font-semibold border-b-2 border-blue-300">Final Price</th>
                <th className="bg-blue-500 text-yellow-300 p-4 text-left font-semibold border-b-2 border-blue-300">Winner Status</th>
                <th className="bg-blue-500 text-yellow-300 p-4 text-left font-semibold border-b-2 border-blue-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {wonAuctions.map((item) => (
                <tr key={item._id}>
                  <td className="p-4 border-b border-blue-300 align-middle flex items-center gap-4">
                    <img src={`https://auctionx-guan.onrender.com${item.image}`} alt="" className="w-12 h-12 object-cover rounded border border-blue-300" />
                    <span>{item.title}</span>
                  </td>
                  <td className="p-4 border-b border-blue-300 align-middle">${item.currentBid}</td>
                  <td className="p-4 border-b border-blue-300 align-middle"><span className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wide bg-green-500 text-white">PAID / WON</span></td>
                  <td className="p-4 border-b border-blue-300 align-middle"><button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Pay Now</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}