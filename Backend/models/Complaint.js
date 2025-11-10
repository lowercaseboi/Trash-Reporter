// Complaint.js

const mongoose = require('mongoose');

// Define complaint schema with logging points
const complaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference User model
    description: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    createdAt: { type: Date, default: Date.now },
    imagePath: { type: String, required: false }, // Add this line for storing the image path
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'], // Define allowed statuses
        default: 'Pending' // Default status is 'Pending'
    }
});

// Create a geospatial index for location
complaintSchema.index({ location: '2dsphere' });

// Middleware to log when a new complaint is created
complaintSchema.post('save', function (doc) {
    console.log('Complaint created with ID:', doc._id, 'and status:', doc.status);
});

// Middleware to log when a complaint's status is updated
complaintSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        console.log('Complaint status updated to:', this.status, 'for complaint ID:', this._id);
    }
    next();
});

// Static method to log when complaints are being queried
complaintSchema.statics.logFindOperation = async function () {
    const complaints = await this.find();
    console.log(complaints.length, 'complaints found in the database');
    return complaints;
};

const Complaint = mongoose.model('Complaint', complaintSchema);

// Remove or comment out the immediate invocation of logFindOperation()
// This prevents database operations before the connection is established
/*
Complaint.logFindOperation()
    .then(complaints => console.log('Complaints retrieved successfully'))
    .catch(error => console.error('Error during complaint retrieval:', error));
*/

module.exports = Complaint;
