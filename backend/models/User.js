const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },
  password: String, // for regular signup/login
  googleId: String,
});
module.exports = mongoose.model('User', userSchema);
