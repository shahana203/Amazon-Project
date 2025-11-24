const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/users');
const orderRoutes =require('./routes/orders')
const productsRoutes =require('./routes/products')
const passport = require('passport');
const cartRoutes = require('./routes/cart');


require('dotenv').config();
require('./controllers/googleAuth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'randomsecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// Example routes (add actual require statements)
app.use('/api/products',productsRoutes );
app.use('/api/orders',orderRoutes );
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes);

app.get("/",(req,res) =>{
res.send("welcome.....")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
