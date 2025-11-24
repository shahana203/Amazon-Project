// const mongoose = require('mongoose');
// const productSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   priceCents: Number,
//   image: String,
//   category: String,
//   rating: { stars: Number, count: Number }
// });
// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

// Review schema for subdocuments
const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },            // Username or userId
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  priceCents: Number,
  image: String,
  category: String,
  rating: { stars: Number, count: Number },
  reviews: [reviewSchema]         // Embed reviews here
});

module.exports = mongoose.model('Product', productSchema);



