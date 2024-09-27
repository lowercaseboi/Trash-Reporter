const express = require('express');
const multer = require('multer'); // Import multer
const Complaint = require('../models/Complaint');
const verifyToken = require('../middleware/authmiddleware'); // Import the middleware

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    }
});

const upload = multer({ storage: storage }); // Create multer instance with storage config
const router = express.Router();

// POST /api/complaints
router.post('/', verifyToken, upload.single('image'), async (req, res) => { // Use the middleware and multer here
    const { description } = req.body; // Get description from the request body
    const location = JSON.parse(req.body.location); // Parse the location string
    const userId = req.userId; // Get user ID from the middleware

    console.log('Incoming complaint submission:');
    console.log('User ID:', userId);
    console.log('Description:', description);
    console.log('Location:', location);
    console.log('Uploaded File:', req.file ? req.file.path : 'No file uploaded');

    try {
        const newComplaint = new Complaint({
            userId, // Associate the complaint with the user
            description,
            location: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude],
            },
            imagePath: req.file ? req.file.path : null // Store the path of the uploaded image
        });

        console.log('Creating new complaint:', newComplaint);
        
        await newComplaint.save();
        console.log('Complaint submitted successfully:', newComplaint);
        res.status(201).json({ message: 'Complaint submitted successfully' });
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(400).json({ message: 'Error submitting complaint', error: error.message });
    }
});

// GET /api/complaints/user
router.get('/user', verifyToken, async (req, res) => {
    const userId = req.userId; // Get the user ID from the middleware

    console.log('Fetching complaints for user ID:', userId);

    try {
        const userComplaints = await Complaint.find({ userId }); // Find complaints by user ID
        console.log('Fetched user complaints:', userComplaints);
        res.status(200).json(userComplaints); // Return the user's complaints
    } catch (error) {
        console.error('Error fetching user complaints:', error);
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
});

// GET /api/complaints/all
router.get('/all', verifyToken, async (req, res) => {
    console.log('Fetching all complaints');

    try {
        const complaints = await Complaint.find(); // Adjust according to your model
        console.log('Fetched all complaints:', complaints);
        res.json(complaints);
    } catch (err) {
        console.error('Error fetching complaints:', err);
        res.status(500).json({ message: 'An error occurred while fetching complaints', error: err.message });
    }
});

module.exports = router;
