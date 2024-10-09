// models/WasteCollection.js
const mongoose = require("mongoose");

const wasteCollectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wasteQty: {
      type: Number,
      required: true,
    },
    recyclableQty: {
      type: Number,
      required: true,
    },
    region: { // Added field to store the region-specific data
      type: String,
      required: true,
    },
    collectionDate: {
      type: Date,
      default: Date.now,
    },
    customerId: { // Field to store the custom customer ID
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

const WasteCollection = mongoose.model("WasteCollection", wasteCollectionSchema);

module.exports = WasteCollection;
