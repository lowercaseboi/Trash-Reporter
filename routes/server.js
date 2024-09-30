require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the Frontend/Public directory
app.use(express.static(path.join(__dirname, '../Frontend/public')));

// Serve static files from the uploads directory for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Import User model and routes
const User = require('./models/users');
const userRoute = require('./routes/userroutes'); // Correctly import user routes
const complaintsRoute = require('./routes/complaints'); 

// Use the routes
app.use('/api', userRoute); // Users route
app.use('/api/complaints', complaintsRoute); // Complaints route 

// Catch-all route to serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
