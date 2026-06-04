import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { io } from 'socket.io-client';
import CountdownTimer from './CountdownTimer';

const socket = io('https://auctionx-guan.onrender.com');

export default function AuctionDetail() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role');
  const currentUserId = localStorage.getItem('userId');

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isGlowing, setIsGlowing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAuction = async () => {
      try {
        const res = await api.get(`/auctions/${id}`);
        setAuction(res.data);
      } catch (err) {
        console.error("Failed to fetch auction details", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuction();
    socket.emit('joinAuction', id);

    socket.on('bidUpdated', (data) => {
      if (data.auctionId === id) {
        setAuction((prev) => {
          if (!prev) return prev;
          
          const newBidEntry = {
            bidder: { username: data.bidderName || "User", _id: data.bidder },
            amount: Number(data.newPrice),
            createdAt: new Date()
          };

          return {
            ...prev,
            currentBid: Number(data.newPrice),
            highestBidder: { 
    _id: data.bidder, 
    username: data.bidderName 
  },
            bids: [newBidEntry, ...(prev.bids || [])].slice(0, 5) 
          };
        });

        if (String(data.bidder).trim() !== String(currentUserId).trim()) {
          alert("Attention: You have been outbid!");
        } else {
          setBidAmount('');
        }
      }
    });

    const timeRef = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      socket.off('bidUpdated');
      clearInterval(timeRef);
    };
  }, [id, currentUserId]);

  useEffect(() => {
    if (auction?.currentBid) {
      setIsGlowing(true);
      const timer = setTimeout(() => setIsGlowing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [auction?.currentBid]);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-[#7CA8DC]">Curating details...</div>;
  if (!auction) return <div className="flex min-h-screen items-center justify-center text-[#F15B42]">Auction not found.</div>;

  const auctionStart = new Date(auction.startTime);
  const auctionEnd = new Date(auction.endTime);
  const hasStarted = currentTime >= auctionStart;
  const hasEnded = currentTime >= auctionEnd;

  const isOwner = String(auction.owner?._id || auction.owner) === String(currentUserId);
  const isSeller = storedRole === 'seller';
  const isWinning = auction.highestBidder && String(auction.highestBidder?._id || auction.highestBidder) === String(currentUserId);

  const handleBid = async (e) => {
    e.preventDefault();
    const amount = Number(bidAmount);
    const minRequired = auction.currentBid + auction.minIncrement;

    if (amount < minRequired) {
      alert(`Your bid must be at least $${minRequired}`);
      return;
    }

    try {
      await api.post(`/auctions/${id}/bid`, { amount: amount });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place bid");
    }
  };

  return (
    <div className={token ? "flex min-h-screen w-screen overflow-hidden" : "block w-full"}>
      {token ? <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> : (
        <nav className="sticky top-0 z-[1000] flex h-20 w-full items-center border-b border-[#49698e] bg-[#2C3D73]">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-8 text-white">
            <Link to="/" className="text-2xl font-black no-underline text-white">AUCTION<span className="text-[#888]">X</span></Link>
            <div className="flex items-center gap-10">
              <Link to="/login" className="no-underline text-[#cbd5e1] hover:text-[#FFD372]">Login</Link>
              <Link to="/register" className="rounded bg-black px-6 py-3 font-semibold no-underline text-white">Join Now</Link>
            </div>
          </div>
        </nav>
      )}

      <main className={token ? "flex min-w-0 flex-1 flex-col bg-[#2C3D73] text-[#FFD372]" : "flex w-full flex-col bg-[#37477a] text-white"}>
        {token && <Topbar onMenuClick={() => setSidebarOpen((o) => !o)} />}

        <div className={token ? "w-full p-10 max-md:p-5" : "mx-auto w-full max-w-[1200px] px-8 py-16"}>
          <div className="grid grid-cols-1 items-start gap-12 min-[901px]:grid-cols-2">
            
            {/* LEFT: IMAGE & RECENT BIDS */}
            <div className="flex flex-col gap-8">
              <div className="relative w-full overflow-hidden rounded-lg border border-[#7CA8DC] bg-[rgba(124,170,220,0.12)]">
                <img 
                  src={auction.image ? `https://auctionx-guan.onrender.com${auction.image}` : '/placeholder.jpg'} 
                  alt={auction.title} 
                  className="block h-[450px] w-full object-cover"
                />
                <div className={`absolute left-3.5 top-3.5 rounded-md px-2.5 py-1 text-xs font-extrabold uppercase text-[#2C3D73] ${hasEnded ? 'bg-gray-400' : 'bg-[#FFD372]'}`}>
                  {hasEnded ? 'Closed' : auction.status}
                </div>
              </div>

              {/* RECENT BIDS SECTION */}
              <div className="rounded-xl border border-[#7CA8DC]/30 bg-[rgba(255,255,255,0.03)] p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#7CA8DC]">Top 5 Recent Bids</h3>
                <div className="flex flex-col gap-3">
                  {auction.bids && auction.bids.length > 0 ? (
                    auction.bids.map((bid, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-[rgba(124,170,220,0.05)] p-3 transition-all hover:bg-[rgba(124,170,220,0.1)]">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[#FFD372]" />
                          <span className="text-sm font-semibold text-white">@{bid.bidder?.username}</span>
                        </div>
                        <span className="font-mono font-bold text-[#FFD372]">${bid.amount.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-xs italic text-[#7CA8DC]">No bidding activity yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: INFO & BIDDING PANEL */}
            <div className="min-w-0">
              <span className="block text-xs font-bold uppercase text-[#7CA8DC]">Seller: @{auction.owner?.username}</span>
              <h1 className="my-2 break-words text-[clamp(1.6rem,2.6vw,2.6rem)] font-black leading-[1.05] text-[#FFD372]">{auction.title}</h1>
              <p className="mb-8 break-words text-base leading-[1.65] text-[#7CA8DC]">{auction.description}</p>

              <div className="rounded-2xl border border-[#7CA8DC] bg-[#3d4d80] p-8 shadow-2xl">
                {isWinning && !hasEnded && (
                  <div className="mb-6 animate-bounce rounded-md bg-[#d1fae5] py-2 text-center text-xs font-bold uppercase text-[#065f46] border border-[#065f46]">
                    🏆 You are the highest bidder!
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#7CA8DC]">Current Bid</label>
                    <div className={`text-[2.8rem] font-black transition-all duration-500 origin-left ${isGlowing ? "text-white scale-105" : "text-[#FFD372]"}`}>
                      ${auction.currentBid.toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 border-y border-[#7CA8DC]/20 py-6">
                    <div>
                      <span className="mb-1 block text-xs uppercase text-[#7CA8DC]">Min. Increment</span>
                      <strong className="text-xl text-white">+${auction.minIncrement}</strong>
                    </div>
                    <div>
                      <span className="mb-1 block text-xs uppercase text-[#7CA8DC]">Time Remaining</span>
                      <CountdownTimer endTime={auction.endTime} startTime={auction.startTime} />
                    </div>
                  </div>

                  {/* DYNAMIC ACTION AREA */}
                  {!token ? (
                    <Link to="/login" className="block w-full rounded-xl bg-[#F15B42] py-4 text-center font-bold text-white no-underline hover:bg-[#F49CC4]">Sign In to Bid</Link>
                  ) : !hasStarted ? (
                    <div className="rounded-lg bg-blue-900/40 p-5 text-center border border-blue-400">
                      <p className="m-0 font-bold text-blue-400">AUCTION STARTS SOON</p>
                      <small className="text-[#7CA8DC]">Opens at {new Date(auction.startTime).toLocaleString()}</small>
                    </div>
                  ) : hasEnded ? (
                    <div className="rounded-lg bg-black/40 p-5 text-center border border-gray-600">
                      <p className="m-0 font-bold text-gray-400">AUCTION CLOSED</p>
                      <small className="text-[#7CA8DC]">Winner: @{
        auction.highestBidder?.username || 
        (auction.bids && auction.bids[0]?.bidder?.username) || 
        'No Bids'
      }</small>
                    </div>
                  ) : isOwner || isSeller ? (
                    <div className="rounded-lg bg-white/5 p-5 text-center border border-white/10">
                      <p className="m-0 text-sm text-[#7CA8DC]">Bidding restricted for {isOwner ? 'Owners' : 'Sellers'}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBid} className="flex flex-col gap-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#2C3D73]">$</span>
                        <input 
                          type="number" 
                          placeholder={`Min. ${(auction.currentBid + auction.minIncrement).toLocaleString()}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="w-full rounded-xl border-none bg-white py-4 pl-10 pr-4 text-xl font-bold text-[#2C3D73] outline-none ring-4 ring-transparent focus:ring-[#FFD372]"
                          required
                        />
                      </div>
                      <button type="submit" className="rounded-xl bg-[#F15B42] py-4 text-lg font-black text-white hover:bg-[#F49CC4]">PLACE YOUR BID</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}