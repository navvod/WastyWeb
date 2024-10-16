const express = require('express');
const router = express.Router();
const specialCollectionController = require('../controllers/specialCollectionController');

// Ensure the function names are accurate and correctly referenced
router.post('/', specialCollectionController.createSpecialRequest);
router.get('/', specialCollectionController.getAllRequests);
router.get('/customer/:customerId', specialCollectionController.getRequestsByCustomerId);
router.get('/count', specialCollectionController.getRequestCount);
router.put('/:id', specialCollectionController.updateRequest);
router.patch('/:id/status', specialCollectionController.approveOrDenyRequest);
router.delete('/:id', specialCollectionController.deleteRequest);
router.get('/:id', specialCollectionController.getRequestById);


module.exports = router;
