const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createAuction, getMyListings, getAllAuctions, getAuctionById } = require('../controllers/auctionController');
const verifyToken = require('../middlewares/authMiddleware');

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
router.get('/all', getAllAuctions);
router.get('/:id', getAuctionById);
module.exports = router;