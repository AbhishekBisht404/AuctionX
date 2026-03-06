const express=require('express');
const verifyToken=require('../middlewares/authMiddleware');
const authorizeRoles=require('../middlewares/roleMiddleware');
const router=express.Router();


// only admin can access 
router.get('/admin', verifyToken,authorizeRoles("admin"), (req, res) => {
    res.status(200).json({message:"Welcome Admin"});
});



// admin and seller can access
router.get('/seller',verifyToken,authorizeRoles("admin","seller"), (req,res)=>{
    res.status(200).json({message:"Welcome Seller"});
})

// admin and bidder can access
router.get('/bidder',verifyToken,authorizeRoles("admin","bidder"), (req,res)=>{
    res.status(200).json({message:"Welcome Bidder"});
})

// all can access these routes
router.get('/all',verifyToken,authorizeRoles("admin","seller","bidder"), (req,res)=>{
    res.status(200).json({message:"Welcome User"});
});

module.exports=router;

