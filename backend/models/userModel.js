const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role:{type:String,enum:["admin","bidder","seller"],required:true},
  avatar: { type: String, default: "" }, // optional profile picture

},
{
  timestamps:true
});
userSchema.index({ email: 1, role: 1 }, { unique: true });
// ek email se hamare pass multiple roles wale accounts ho sakte h pr ek email and role k combination unique hona cahiye
// hashing of password is done in authController.js 

// checking also done in authController.js

module.exports = mongoose.model('User', userSchema);