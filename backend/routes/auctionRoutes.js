const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createAuction, getMyListings, getAllAuctions, getAuctionById, getWonAuctions, getAllAuctionsAdmin, deleteAuction, getJoinedAuctions } = require('../controllers/auctionController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

router.post('/', verifyToken, upload.single('itemImage'), createAuction);
router.get('/my-listings', verifyToken, getMyListings);
router.get('/won', verifyToken, getWonAuctions);
router.get('/all', getAllAuctions);
router.get('/admin/all', verifyToken, authorizeRoles('admin'), getAllAuctionsAdmin);
router.delete('/admin/:id', verifyToken, authorizeRoles('admin'), deleteAuction);
router.get('/:id', getAuctionById);
router.get('/joined', verifyToken, getJoinedAuctions);
module.exports = router;