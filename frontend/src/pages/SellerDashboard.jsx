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
    <div className="w-full">
      <div className="bg-blue-900 border border-blue-600 rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-600">
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-300 m-0">My Active Listings</h3>
          <Link to="/create-auction" className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition-colors text-center">
            + New Auction
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-blue-300 py-8 px-4">Loading your listings...</p>
        ) : activeListings.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-blue-300 text-base">You have no active listings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-yellow-300">
              <thead>
                <tr className="bg-blue-800">
                  <th className="px-4 py-3 sm:px-6 text-left font-semibold text-xs sm:text-sm">Item Title</th>
                  <th className="px-4 py-3 sm:px-6 text-left font-semibold text-xs sm:text-sm">Current Bid</th>
                  <th className="px-4 py-3 sm:px-6 text-left font-semibold text-xs sm:text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeListings.map(auction => (
                  <tr key={auction._id} className="border-t border-blue-600 hover:bg-blue-800/50 transition-colors">
                    <td className="px-4 py-3 sm:px-6 font-medium text-sm sm:text-base truncate">{auction.title}</td>
                    <td className="px-4 py-3 sm:px-6 text-sm sm:text-base">${auction.currentBid}</td>
                    <td className="px-4 py-3 sm:px-6"><span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">Active</span></td>
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
