const User = require('../models/userModel');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const mongoose = require('mongoose');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users', error: error.message });
  }
};

exports.getUserAuctions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const auctions = await Auction.find({ owner: userId })
      .sort({ createdAt: -1 });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user auctions', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userAuctions = await Auction.find({ owner: userId }).distinct('_id');
    await Bid.deleteMany({ auction: { $in: userAuctions } });
    await Bid.deleteMany({ bidder: userId });
    await Auction.deleteMany({ owner: userId });
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user', error: error.message });
  }
};
