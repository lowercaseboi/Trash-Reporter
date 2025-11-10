// Admin/AdminBackend/models/Complaint.js

const mongoose = require('../db'); // Use the connected Mongoose instance

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  createdAt: { type: Date, default: Date.now },
  imagePath: { type: String, required: false },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
});

// Create a geospatial index for location
complaintSchema.index({ location: '2dsphere' });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
