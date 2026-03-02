const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // image URL
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  startingPrice: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  minIncrement: { type: Number, default: 1 },

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  status: { type: String, enum: ['upcoming','active','ended','paid'], default: 'upcoming' },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Auction', auctionSchema);