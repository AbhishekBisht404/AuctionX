import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
    <div className="font-sans text-white bg-[#37477a]">
      <nav className="sticky top-0 z-[1000] flex h-20 items-center border-b border-[#49698e] bg-[#2C3D73]">
        <div className="mx-auto flex w-full max-w-[1300px] justify-between px-8">
          <Link to="/" className="text-2xl font-black tracking-[-1px] no-underline text-white">AUCTION<span className="text-[#888]">X</span></Link>
          <div className="flex items-center gap-8">
            <Link to="/login" className="font-medium no-underline text-[#cbd5e1] hover:text-white">Sign In</Link>
            <Link to="/register" className="rounded border border-white px-8 py-4 font-semibold no-underline text-white transition hover:bg-white/10">Get Started</Link>
          </div>
        </div>
      </nav>

      <header
        className="h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070')" }}
      >
        <div className="flex h-full items-center bg-gradient-to-r from-[#37477a]/95 to-transparent px-[10%]">
          <div className="max-w-[600px]">
            <span className="text-xs font-bold uppercase tracking-[2px] text-[#888]">Live & Exclusive</span>
            <h1 className="my-6 text-[clamp(2.2rem,6vw,4rem)] leading-none tracking-[-3px]">Discover & Bid on <br/>Unique Antiques.</h1>
            <p className="mb-8 text-xl text-[#cbd5e1]">The world's premier destination for rare collectibles and historical pieces.</p>
            <div>
              <a href="#explore" className="rounded bg-black px-8 py-4 font-semibold no-underline text-white transition hover:bg-[#333]">Explore Market</a>
              <Link to="/register" className="ml-4 rounded border border-black px-8 py-4 font-semibold no-underline text-black">Start Selling</Link>
            </div>
          </div>
        </div>
      </header>

      <main id="explore" className="mx-auto max-w-[1300px] px-8 py-20">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="m-0 text-[2rem] tracking-[-1px]">Latest Opportunities</h2>
          <div className="text-sm text-[#666]">Updated just now</div>
        </div>

        {loading ? (
          <div className="text-base text-[#cbd5e1]">Curating collection...</div>
        ) : auctions.length === 0 ? (
          <div className="text-base text-[#666]">No active auctions at the moment.</div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-12">
            {auctions.map((item) => (
              <Link to={`/auction/${item._id}`} key={item._id} className="text-inherit no-underline">
                <div className="group relative aspect-square overflow-hidden border border-[#49698e] bg-[#2C3D73]">
                  <img 
                    src={item.image ? `https://auctionx-guan.onrender.com${item.image}` : '/placeholder.jpg'} 
                    alt={item.title} 
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 bg-[#FFD372] px-3 py-1 text-xs font-bold uppercase text-[#2C3D73]">Ending Soon</div>
                </div>
                <div className="px-0 py-6">
                  <span className="text-xs font-semibold uppercase text-[#999]">@{item.owner?.username || 'Curator'}</span>
                  <h3 className="my-2 mb-6 text-xl">{item.title}</h3>
                  <div className="flex items-end justify-between border-t border-[#e5e7eb] pt-4">
                    <div>
                      <label className="block text-[0.7rem] uppercase text-[#888]">Current Bid</label>
                      <span className="text-[1.4rem] font-extrabold">${item.currentBid.toLocaleString()}</span>
                    </div>
                    <div className="text-sm font-bold underline underline-offset-4">View Item</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-[100px] bg-[#0a0a0a] px-0 pb-10 pt-20 text-white">
  <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-16 px-8 md:grid-cols-[1fr_2fr]">
    <div>
      <Link to="/" className="mb-6 block text-2xl font-black text-white no-underline">AUCTION<span className="text-[#888]">X</span></Link>
      <p className="max-w-[300px] text-[0.95rem] leading-6 text-[#888] md:max-w-none">
        The premier destination for discovering and bidding on extraordinary items.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div>
        <h4 className="mb-6 text-xs uppercase tracking-[2px] text-white">Marketplace</h4>
        <Link to="/" className="mb-3 block text-sm text-[#888] no-underline transition hover:text-white">Explore Auctions</Link>
        <Link to="/register" className="mb-3 block text-sm text-[#888] no-underline transition hover:text-white">Become a Seller</Link>
        <Link to="/login" className="mb-3 block text-sm text-[#888] no-underline transition hover:text-white">Buyer Protection</Link>
      </div>

      <div>
        <h4 className="mb-6 text-xs uppercase tracking-[2px] text-white">Support</h4>
        <Link to="/" className="mb-3 block text-sm text-[#888] no-underline transition hover:text-white">Help Center</Link>
        <Link to="/" className="mb-3 block text-sm text-[#888] no-underline transition hover:text-white">Terms of Service</Link>
        <Link to="/" className="mb-3 block text-sm text-[#888] no-underline transition hover:text-white">Privacy Policy</Link>
      </div>

      <div>
        <h4 className="mb-6 text-xs uppercase tracking-[2px] text-white">Connect</h4>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mb-3 block text-sm text-[#888] no-underline transition hover:text-white">Instagram</a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="mb-3 block text-sm text-[#888] no-underline transition hover:text-white">Twitter</a>
      </div>
    </div>
  </div>
  
  <div className="mx-auto mt-16 flex max-w-[1300px] justify-center border-t border-[#222] px-8 pt-8">
    <p className="text-xs uppercase tracking-[1px] text-[#555]">&copy; 2026 AUCTIONX. Designed for the Extraordinary.</p>
  </div>
</footer>
    </div>
  );
}