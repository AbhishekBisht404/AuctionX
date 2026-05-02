const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const mongoose = require('mongoose');

exports.getMyListings = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const listings = await Auction.find({ owner: userId });

    console.log(`Success! Found ${listings.length} listings for user ${req.user.id}`);
    
    res.status(200).json(listings);
  } catch (error) {
    console.error("Fetch Error Detail:", error);
    res.status(500).json({ message: "Server error fetching listings" });
  }
};

exports.getWonAuctions = async (req, res) => {
  try {
    // An auction is "Won" if status is ended AND the user is the highest bidder
    const wonAuctions = await Auction.find({ 
      highestBidder: req.user.id, 
      status: 'ended' 
    }).populate('owner', 'username email');
    
    res.status(200).json(wonAuctions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching won auctions.' });
  }
};

exports.createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, minIncrement, startTime, endTime } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newAuction = new Auction({
      title,
      description,
      image: imageUrl, 
      owner: req.user.id,
      startingPrice: Number(startingPrice),
      currentBid: Number(startingPrice), 
      minIncrement: Number(minIncrement || 1),
      startTime: startTime || new Date(), 
      endTime: endTime,
      status: 'active'
    });

    const savedAuction = await newAuction.save();
    res.status(201).json(savedAuction);
  } catch (error) {
    console.error("Mongoose Error:", error.message);
    res.status(500).json({ message: 'Error creating auction', error: error.message });
  }
};

exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'active' })
      .populate('owner', 'username') 
      .sort({ createdAt: -1 }); 

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching market data" });
  }
};

exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('owner', 'username email');
    
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    
    res.status(200).json(auction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllAuctionsAdmin = async (req, res) => {
  try {
    const auctions = await Auction.find({})
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching auctions", error: error.message });
  }
};

exports.deleteAuction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid auction ID' });
    }
    await Bid.deleteMany({ auction: id });
    const deletedAuction = await Auction.findByIdAndDelete(id);
    if (!deletedAuction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.status(200).json({ message: 'Auction and associated bids deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting auction', error: error.message });
  }
};

exports.placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const auctionId = req.params.id;

    if (req.user.role === 'seller') {
      return res.status(403).json({ message: "Access Denied: Seller accounts are not permitted to place bids." });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found." });
    }

    if (auction.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "Restriction: You cannot place a bid on your own listing." });
    }

    const minimumRequired = auction.currentBid + auction.minIncrement;
    if (Number(amount) < minimumRequired) {
      return res.status(400).json({ message: `Bid too low. The minimum acceptable bid is $${minimumRequired}.` });
    }

    auction.currentBid = Number(amount);
    auction.highestBidder = req.user.id;
    
    const newBid = new Bid({
      auction: auctionId,
      bidder: req.user.id,
      amount: Number(amount)
    });

    await Promise.all([auction.save(), newBid.save()]);

    // --- LIVE BIDDING BROADCAST ---
    const io = req.app.get('socketio'); // Get io from server.js
    
    io.to(auctionId).emit('bidUpdated', {
      auctionId: auctionId,
      newPrice: auction.currentBid,
      bidder: req.user.id
    });
    // ------------------------------

    res.status(200).json({ 
      message: "Success! You are currently the highest bidder.", 
      currentBid: auction.currentBid 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error processing bid.", error: error.message });
  }
};

exports.getJoinedAuctions = async (req, res) => {
  try {
    const userId = req.user.id;

    const bids = await Bid.find({ bidder: userId }).distinct('auction');
    
    const auctions = await Auction.find({ _id: { $in: bids } })
      .populate('owner', 'username')
      .sort({ endTime: 1 });

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching joined auctions", error: error.message });
  }
};