const Bid = require('../models/Bid');

exports.getMyBids = async (req, res) => {
  try {
    const myBids = await Bid.find({ bidder: req.user.id })
      .populate('auction') 
      .sort({ createdAt: -1 });

    res.status(200).json(myBids);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching your bids.', error: error.message });
  }
};