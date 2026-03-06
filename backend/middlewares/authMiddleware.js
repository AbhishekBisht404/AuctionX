const jwt=require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
   let token;
   let authHeader=req.headers.Authorization || req.headers.authorization;
   if(authHeader && authHeader.startsWith("Bearer ")){
    token=authHeader.split(" ")[1];
if(!token){
    return res.status(401).json({message:"No token provided, authorization denied"});
}
try{
const decode=jwt.verify(token,process.env.JWT_SECRET);
req.user=decode;
console.log("Decoded user is :", req.user);
next();
}catch(err){
    res.status(401).json({message:"Invalid token, authorization denied"});
}



   }else{
    return res.status(401).json({message:"No token provided, authorization denied"});
   }
}

module.exports=verifyToken;