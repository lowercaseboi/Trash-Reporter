// AdminBackend/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.set('debug', true);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Admin Backend: MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

module.exports = mongoose;
