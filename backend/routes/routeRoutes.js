const express = require('express');
const router = express.Router();
const {
  addRoute,
  updateRoute,
  getRouteById,
  getAllRoutes,
  deleteRoute,
  assignCollectorToRoute,
} = require('../controllers/routeController'); // Ensure this path is correct

// Route to add a new route
router.post('/addroutes', addRoute);

// Route to update an existing route by routeId
router.put('/updateroutes/:routeId', updateRoute);

// Route to get a specific route by routeId
router.get('/getroutes/:routeId', getRouteById);

// Route to get all routes
router.get('/allroutes', getAllRoutes);

// Route to delete a route by routeId
router.delete('/deleteroutes/:routeId', deleteRoute);

router.post('/assignCollector', assignCollectorToRoute);

module.exports = router;
