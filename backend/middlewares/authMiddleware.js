// authMiddleware.js
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');

exports.authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.id);
    if (customer.status !== 'Approved') {
      return res.status(403).json({ error: 'Access denied, documents not approved' });
    }
    req.customer = customer;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
