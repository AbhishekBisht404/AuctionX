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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen w-screen overflow-hidden bg-blue-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex flex-col flex-grow overflow-y-auto bg-blue-800 text-yellow-300 min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen((o) => !o)} />
        
        <div className="p-4 sm:p-6 md:p-10 w-full">
          <header className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 m-0 mb-2">Live Auctions</h2>
            <p className="text-sm sm:text-base text-blue-300 m-0">Items available for bidding right now.</p>
          </header>

          {loading ? (
            <p className="text-center text-blue-300 text-base py-8">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-max">
              {auctions.length > 0 ? (
                auctions.map((item) => (
                  <Link to={`/auction/${item._id}`} key={item._id} className="text-inherit no-underline">
                    <div className="bg-blue-900 border border-blue-600 rounded-lg overflow-hidden hover:border-yellow-300 transition-colors group cursor-pointer">
                      <div className="w-full h-40 sm:h-48 overflow-hidden bg-blue-800">
                        <img 
                          src={item.image ? `http://localhost:5000${item.image}` : '/placeholder.jpg'} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <span className="text-xs text-blue-300">By {item.owner?.username}</span>
                        <h3 className="text-base sm:text-lg font-bold text-yellow-300 mt-2 mb-3 line-clamp-2">{item.title}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-lg sm:text-xl font-bold text-yellow-300">${item.currentBid}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-4xl mb-4">🏛️</div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">No Live Auctions</h3>
                  <p className="text-blue-300">There are no items currently up for bidding. Please check back later!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}