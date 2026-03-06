const express = require('express');
const router = express.Router();
const { getMyListings, getWonAuctions } = require('../controllers/auctionController');
const verifyToken = require('../middlewares/authMiddleware');

// Route: /api/auctions/...
router.get('/my-listings', verifyToken, getMyListings);
router.get('/won', verifyToken, getWonAuctions);

module.exports = router;