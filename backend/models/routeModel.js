const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  routeName: { type: String, required: true },
  startingPoint: { type: String, required: true },
  endingPoint: { type: String, required: true },
  collectorId: { type: String, required: false } // Field for the assigned collector
});

module.exports = mongoose.model('Route', routeSchema);
