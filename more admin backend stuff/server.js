// Admin/AdminBackend/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('./db'); // Use the connected Mongoose instance
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors()); // Allow all origins during development
app.use(express.json()); // Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Serve static files from AdminFrontend folder
app.use(express.static(path.join(__dirname, '..', 'AdminFrontend')));

// Import router and authenticateAdmin
const { router: adminRoutes } = require('./routes/adminroutes');

// Admin Routes
app.use('/api/admin', adminRoutes);

// Redirect root to the login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'AdminFrontend', 'adminlogin.html'));
});

// Serve admin dashboard
app.get('/admindashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'AdminFrontend', 'admindashboard.html'));
});

// Serve static files from the user backend's uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'Backend', 'uploads')));

// 404 Route for undefined routes
app.use((req, res, next) => {
    console.log('Route not found:', req.originalUrl);
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
});

// Start the server after ensuring MongoDB connection
mongoose.connection.once('open', () => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Admin backend server running on port ${PORT}`);
    });
});
