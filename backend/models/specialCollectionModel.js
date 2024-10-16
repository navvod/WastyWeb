const mongoose = require('mongoose');

const specialCollectionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  requestType: { type: String, required: true },
  address: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  dateRequested: { type: Date, default: Date.now },
  notes: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Denied'],
    default: 'Pending'
  },
});

module.exports = mongoose.model('SpecialCollection', specialCollectionSchema);
