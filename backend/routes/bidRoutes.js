const express = require('express');
const router = express.Router();
const { getMyBids } = require('../controllers/bidController'); 
const verifyToken = require('../middlewares/authMiddleware');

// Route: /api/bids/...
router.get('/my-bids', verifyToken, getMyBids);

module.exports = router;