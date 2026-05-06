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
    const userId = req.user.id || req.user._id;
    const now = new Date();

    const wonAuctions = await Auction.find({ 
      highestBidder: userId,
      endTime: { $lt: now } // $lt means "Less Than" (Past)
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
    res.status(500).json({ message: 'Error creating auction', error: error.message });
  }
};

exports.getAllAuctions = async (req, res) => {
  try {
    const now = new Date();

    const auctions = await Auction.find({ 
      status: 'active',
      endTime: { $gt: now } 
    })
    .populate('owner', 'username') 
    .sort({ createdAt: -1 }); 

    res.status(200).json(auctions);
  } catch (error) {
    console.error("Market Fetch Error:", error);
    res.status(500).json({ message: "Error fetching market data" });
  }
};
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('highestBidder', 'username'); 
    
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const recentBids = await Bid.find({ auction: req.params.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('bidder', 'username');

    const auctionData = auction.toObject();
    auctionData.bids = recentBids;
    
    res.status(200).json(auctionData);
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
    const now = new Date();

    if (req.user.role === 'seller') {
      return res.status(403).json({ message: "Access Denied: Sellers cannot bid." });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found." });

    if (now < new Date(auction.startTime)) {
      return res.status(400).json({ message: "This auction has not started yet." });
    }

    if (now > new Date(auction.endTime)) {
      auction.status = 'ended';
      await auction.save();
      return res.status(400).json({ message: "This auction has already ended." });
    }

    if (auction.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot bid on your own listing." });
    }

    const minimumRequired = auction.currentBid + auction.minIncrement;
    if (Number(amount) < minimumRequired) {
      return res.status(400).json({ message: `Minimum bid is $${minimumRequired}.` });
    }

    auction.currentBid = Number(amount);
    auction.highestBidder = req.user.id;
    
    const newBid = new Bid({
      auction: auctionId,
      bidder: req.user.id,
      amount: Number(amount)
    });

    await Promise.all([auction.save(), newBid.save()]);

    const io = req.app.get('socketio');
    
    io.to(auctionId).emit('bidUpdated', {
      auctionId: auctionId,
      newPrice: auction.currentBid,
      bidder: req.user.id,
      bidderName: req.user.username 
    });

    res.status(200).json({ 
      message: "Success! You are the leader.", 
      currentBid: auction.currentBid 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

exports.getJoinedAuctions = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const now = new Date();

    const auctionIds = await Bid.find({ bidder: userId }).distinct('auction');
    
    const auctions = await Auction.find({ 
      _id: { $in: auctionIds },
      endTime: { $gt: now } 
    })
    .populate('owner', 'username')
    .sort({ endTime: 1 });

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};