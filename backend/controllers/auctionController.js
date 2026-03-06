const Auction = require('../models/Auction');


exports.getMyListings = async (req, res) => {
  try {

    const auctions = await Auction.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching your listings.', error: error.message });
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