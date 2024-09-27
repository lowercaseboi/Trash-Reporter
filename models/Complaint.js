const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    createdAt: { type: Date, default: Date.now },
    imagePath: { type: String, required: false } // Add this line for storing the image path
});

complaintSchema.index({ location: '2dsphere' }); // Create a geospatial index

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
