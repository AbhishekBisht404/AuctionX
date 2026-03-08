const express = require('express');
const router = express.Router();
const { getMyBids, getBidsByUser, deleteBid } = require('../controllers/bidController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

router.get('/my-bids', verifyToken, getMyBids);
router.get('/admin/:userId', verifyToken, authorizeRoles('admin'), getBidsByUser);
router.delete('/admin/:bidId', verifyToken, authorizeRoles('admin'), deleteBid);

module.exports = router;