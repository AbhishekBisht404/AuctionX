const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const User=require('../models/userModel');
const register=async (req, res)=>{
  try{
  const {username,email,password,role}=req.body;
  const hashedPassword=await bcrypt.hash(password,10);
 
   const existingUser=await User.findOne({email,role});
   if(existingUser){
    return res.status(400).json({message:"User already exists with this email and role"});
   }

  const newUser=new User({username,email,password:hashedPassword,role});

    await newUser.save();
    res.status(201).json({message:"User registered successfully"});
  }catch(err){
    res.status(500).json({message:`Server error ${err.message}` });
  }
}

const login=async (req, res)=>{
  try{
    const {email,password,role}=req.body;
    const user=await User.findOne({email,role});
    if(!user){
      return res.status(400).json({message:"Invalid credentials"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"});
    }
  
    const token=jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET,
       { expiresIn: "1h" }
      );
      res.status(200).json({
  token,
  role: user.role,
  username: user.username,
  userId: user._id
});
  }catch(err){
    res.status(500).json({message:`Server error ${err.message}` });
  }
}

module.exports={register,login};
