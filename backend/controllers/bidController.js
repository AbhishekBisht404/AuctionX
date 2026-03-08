const Bid = require('../models/Bid');
const mongoose = require('mongoose');

exports.getBidsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const bids = await Bid.find({ bidder: userId })
      .populate('auction', 'title currentBid status')
      .sort({ createdAt: -1 });
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching bids', error: error.message });
  }
};

exports.deleteBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bidId)) {
      return res.status(400).json({ message: 'Invalid bid ID' });
    }
    const deleted = await Bid.findByIdAndDelete(bidId);
    if (!deleted) return res.status(404).json({ message: 'Bid not found' });
    res.status(200).json({ message: 'Bid deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting bid', error: error.message });
  }
};

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