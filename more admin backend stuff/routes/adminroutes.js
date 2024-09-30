// Admin/AdminBackend/routes/adminroutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('../db'); // Import the connected Mongoose instance
const Admin = require('../models/admin'); // Ensure this path is correct
const Complaint = require('../models/Complaint'); // Use the model from AdminBackend
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Middleware to authenticate admin using JWT
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token received:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Admin authenticated successfully:', decoded);
        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Invalid or expired token');
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Admin login route
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received');
        console.log('Request Body:', req.body);

        const { username, password } = req.body;
        console.log('Admin login attempt:', username);

        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log('Admin not found');
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log('Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generated for admin:', token);
        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch all complaints for the admin (Authenticated)
router.get('/reports', authenticateAdmin, async (req, res) => {
    console.log('Mongoose connection readyState:', mongoose.connection.readyState);

    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ message: 'Database not connected' });
    }

    try {
        // Find complaints and populate the userId field with the username
        const reports = await Complaint.find()
            .populate('userId', 'username') // Populate userId with username
            .exec();
        console.log('Reports with populated userId:', reports);
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update complaint status by admin (Authenticated)
router.put('/report/:id', authenticateAdmin, async (req, res) => {
    try {
        const complaintId = req.params.id;
        const { status } = req.body;

        // Validate the status
        const allowedStatuses = ['Pending', 'In Progress', 'Resolved'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Find the complaint and update the status
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { status },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ message: 'Status updated successfully', complaint: updatedComplaint });
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = {
    router,
    authenticateAdmin,
};
