const Auction = require('../models/Auction');
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
    const wonAuctions = await Auction.find({ 
      highestBidder: req.user._id, 
      status: 'ended' 
    }).sort({ endTime: -1 });
    
    res.status(200).json(wonAuctions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching won auctions.', error: error.message });
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