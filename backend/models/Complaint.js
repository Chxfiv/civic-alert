const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['pothole', 'garbage', 'water_leakage', 'streetlight', 'other'],
    default: 'other'
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
  location: {
    address: String,
    lat: Number,
    lng: Number
  },
  image: { type: String },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDuplicate: { type: Boolean, default: false },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  aiAnalysis: {
    detectedCategory: String,
    confidence: Number,
    keywords: [String]
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    note: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
