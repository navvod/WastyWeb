// Create a new Special Collection request
const SpecialCollection = require('../models/specialCollectionModel');
const Customer = require('../models/customerModel');

// Create a special collection request
exports.createSpecialRequest = async (req, res) => {
  try {
    const { customerId, requestType, notes } = req.body;

    // Fetch customer address
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Create special collection request with customer's address
    const specialRequest = new SpecialCollection({
      customerId,
      requestType,
      notes,
      address: customer.address, // Use customer's address here
    });

    const savedRequest = await specialRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a Special Collection request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await SpecialCollection.findById(req.params.id).populate('customerId', 'name email');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving request', error });
  }
};


// Get all Special Collection requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await SpecialCollection.find().populate('customerId', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving requests', error });
  }
};

// Get Special Collection requests by Customer ID
exports.getRequestsByCustomerId = async (req, res) => {
  try {
    const requests = await SpecialCollection.find({ customerId: req.params.customerId });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving requests', error });
  }
};

// Get Special Collection request count
exports.getRequestCount = async (req, res) => {
  try {
    const count = await SpecialCollection.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving request count', error });
  }
};

// Update a Special Collection request by ID
exports.updateRequest = async (req, res) => {
  try {
    const updatedRequest = await SpecialCollection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error updating request', error });
  }
};

// Approve or Deny a Special Collection request by ID
exports.approveOrDenyRequest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Denied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updatedRequest = await SpecialCollection.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error updating request status', error });
  }
};

// Delete a Special Collection request by ID
exports.deleteRequest = async (req, res) => {
  try {
    await SpecialCollection.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error });
  }
};
