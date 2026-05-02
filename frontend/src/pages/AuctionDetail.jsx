import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { io } from 'socket.io-client';

// Initialize socket outside to prevent multiple connections on re-render
const socket = io('http://localhost:5000');

export default function AuctionDetail() {
  const { id } = useParams();
  
  // User context from localStorage
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role');
  const currentUserId = localStorage.getItem('userId');

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAuction = async () => {
      try {
        const res = await api.get(`/auctions/${id}`);
        setAuction(res.data);
        console.log("--- INITIAL LOAD AUDIT ---");
      console.log("My LocalStorage ID:", currentUserId);
      console.log("Auction Owner ID:", res.data.owner?._id || res.data.owner);
      console.log("Current Highest Bidder ID:", res.data.highestBidder?._id || res.data.highestBidder);
      console.log("--------------------------");
      } catch (err) {
        console.error("Failed to fetch auction details", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuction();

    // Join the socket room for this specific auction
    socket.emit('joinAuction', id);

    // Listen for live bid updates
    socket.on('bidUpdated', (data) => {
      if (data.auctionId === id) {
        console.log("--- LIVE BID AUDIT ---");
    console.log("ID sent from Server:", data.bidder);
    console.log("My LocalStorage ID:", currentUserId);
    console.log("Do they match? ", String(data.bidder) === String(currentUserId));
    console.log("----------------------");
        setAuction((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentBid: Number(data.newPrice),
            highestBidder: data.bidder
          };
        });

        // Use String comparison to handle ID mismatches
        const incomingBidderId = String(data.bidder).trim();
        const myId = String(currentUserId).trim();

        if (incomingBidderId !== myId) {
          alert("Attention: You have been outbid!");
        } else {
          setBidAmount(''); // Clear input only for the winner
        }
      }
    });

    return () => {
      socket.off('bidUpdated');
    };
  }, [id, currentUserId]);

  // Trigger Glow effect when price changes
  useEffect(() => {
    if (auction?.currentBid) {
      setIsGlowing(true);
      const timer = setTimeout(() => setIsGlowing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [auction?.currentBid]);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-[#7CA8DC]">Curating details...</div>;
  if (!auction) return <div className="flex min-h-screen items-center justify-center text-[#F15B42]">Auction not found.</div>;

  // Logic Checks
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
      // UI updates automatically via Socket listener
    } catch (err) {
      console.error("Bidding failed:", err);
      alert(err.response?.data?.message || "Failed to place bid");
    }
  };

  return (
    <div className={token ? "flex min-h-screen w-screen overflow-hidden" : "block w-full"}>
      
      {token ? <Sidebar /> : (
        <nav className="sticky top-0 z-[1000] flex h-20 w-full items-center border-b border-[#49698e] bg-[#2C3D73]">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-8">
            <Link to="/" className="text-2xl font-black no-underline text-white">AUCTION<span className="text-[#888]">X</span></Link>
            <div className="flex items-center gap-10">
              <Link to="/login" className="font-medium no-underline text-[#cbd5e1] hover:text-[#FFD372]">Login</Link>
              <Link to="/register" className="rounded bg-black px-6 py-3 font-semibold no-underline text-white">Join Now</Link>
            </div>
          </div>
        </nav>
      )}

      <main className={token ? "flex flex-1 flex-col bg-[#2C3D73] text-[#FFD372]" : "flex w-full flex-col bg-[#37477a] text-white"}>
        {token && <Topbar title="Auction View" />}

        <div className={token ? "w-full p-10 max-md:p-5" : "mx-auto w-full max-w-[1200px] px-8 py-16"}>
          <div className="grid grid-cols-1 items-start gap-9 min-[901px]:grid-cols-2">
            
            {/* LEFT: IMAGE */}
            <div className="relative w-full overflow-hidden rounded-lg border border-[#7CA8DC] bg-[rgba(124,170,220,0.12)]">
              <img 
                src={auction.image ? `http://localhost:5000${auction.image}` : '/placeholder.jpg'} 
                alt={auction.title} 
                className="block h-[420px] max-h-[65vh] w-full object-cover max-[900px]:h-[320px] max-[520px]:h-[260px]"
              />
              <div className="absolute left-3.5 top-3.5 rounded-md bg-[#FFD372] px-2.5 py-1 text-xs font-extrabold uppercase text-[#2C3D73]">{auction.status}</div>
            </div>

            {/* RIGHT: INFO & BIDDING PANEL */}
            <div className="min-w-0">
              <span className="block text-xs font-bold uppercase text-[#7CA8DC]">Seller: @{auction.owner?.username}</span>
              <h1 className="my-2 break-words text-[clamp(1.6rem,2.6vw,2.6rem)] font-black leading-[1.05] text-[#FFD372]">{auction.title}</h1>
              <p className="mb-5 break-words text-base leading-[1.65] text-[#7CA8DC]">{auction.description}</p>

              <div className="rounded-lg border border-[#7CA8DC] bg-[#3d4d80] p-6 shadow-xl">
                
                {/* --- WINNER BADGE --- */}
                {isWinning && (
                  <div className="mb-5 animate-bounce rounded-md bg-[#d1fae5] py-2 text-center text-xs font-bold uppercase text-[#065f46] border border-[#065f46]">
                    🏆 You are currently the highest bidder!
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase text-[#7CA8DC]">Current Bid</label>
                  <div className={`mt-0.5 text-[2.4rem] font-black transition-all duration-500 origin-left ${
                    isGlowing ? "text-white scale-105" : "text-[#FFD372]"
                  }`}>
                    ${auction.currentBid.toLocaleString()}
                  </div>
                </div>

                <div className="mb-3 mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="mb-1 block text-[0.8rem] text-[#7CA8DC]">Min. Increment</span>
                    <strong className="block text-base text-[#FFD372]">+${auction.minIncrement}</strong>
                  </div>
                  <div>
                    <span className="mb-1 block text-[0.8rem] text-[#7CA8DC]">Ends On</span>
                    <strong className="block text-base text-[#FFD372]">{new Date(auction.endTime).toLocaleDateString()}</strong>
                  </div>
                </div>

                <hr className="my-6 border-0 border-t border-t-[rgba(124,170,220,0.3)]" />

                {/* --- DYNAMIC ACTION AREA --- */}
                {!token ? (
                  <div className="text-center">
                    <p className="mb-3 font-semibold text-[#7CA8DC]">Sign in to join the bidding.</p>
                    <Link to="/login" className="inline-block w-full rounded-md bg-[#F15B42] px-4 py-3 text-center font-bold no-underline text-white transition hover:bg-[#F49CC4]">Sign In to Bid</Link>
                  </div>
                ) : isOwner ? (
                  <div className="rounded bg-[rgba(255,211,114,0.1)] p-4 text-center border border-[#FFD372]">
                    <p className="m-0 text-xs font-bold uppercase text-[#FFD372]">Your Listing</p>
                    <small className="text-[#7CA8DC]">Owners cannot bid on their own items.</small>
                  </div>
                ) : isSeller ? (
                  <div className="rounded bg-[rgba(255,211,114,0.1)] p-4 text-center border border-[#FFD372]">
                    <p className="m-0 text-xs font-bold uppercase text-[#FFD372]">Seller Restricted</p>
                    <small className="text-[#7CA8DC]">Please use a Bidder account to participate.</small>
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-[0.9rem] font-semibold text-[#FFD372]">Place Your Bid</label>
                    <form onSubmit={handleBid} className="flex w-full flex-wrap gap-3">
                      <input 
                        type="number" 
                        placeholder={`Min. $${(auction.currentBid + auction.minIncrement).toLocaleString()}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="min-w-0 flex-[1_1_200px] rounded-md border border-[#7CA8DC] bg-white px-4 py-3 text-base text-[#2C3D73] focus:ring-2 focus:ring-[#FFD372] outline-none"
                        required
                      />
                      <button 
                        type="submit" 
                        className="w-full flex-[0_0_auto] rounded-md bg-[#F15B42] px-6 py-3 font-bold text-white transition hover:bg-[#F49CC4] min-[521px]:w-auto"
                      >
                        Place Bid
                      </button>
                    </form>
                    <p className="mt-2 text-[0.7rem] text-[#7CA8DC] uppercase tracking-wider">Next minimum bid: ${auction.currentBid + auction.minIncrement}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {!token && (
          <footer className="mt-16 bg-[#0a0a0a] pb-10 pt-20 text-white">
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-8 md:grid-cols-[1fr_2fr]">
              <div>
                <Link to="/" className="mb-6 block text-2xl font-black text-white no-underline">AUCTION<span className="text-[#888]">X</span></Link>
                <p className="max-w-[300px] text-sm leading-6 text-[#888]">The world's premier destination for rare collectibles.</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="mb-6 text-xs uppercase tracking-[2px]">Marketplace</h4>
                  <Link to="/" className="mb-3 block text-sm text-[#888] no-underline hover:text-white">Explore</Link>
                  <Link to="/register" className="mb-3 block text-sm text-[#888] no-underline hover:text-white">Sell</Link>
                </div>
                <div>
                  <h4 className="mb-6 text-xs uppercase tracking-[2px]">Support</h4>
                  <Link to="/" className="mb-3 block text-sm text-[#888] no-underline hover:text-white">Help Center</Link>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-16 flex max-w-[1200px] justify-center border-t border-[#222] pt-8">
              <p className="text-[10px] uppercase tracking-[2px] text-[#555]">&copy; 2026 AUCTIONX. All Rights Reserved.</p>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}