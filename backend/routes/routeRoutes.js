const express = require('express');
const router = express.Router();
const {
  addRoute,
  updateRoute,
  getRouteById,
  getAllRoutes,
  deleteRoute,
  assignCollectorToRoute,
  getAllAssignedRoutes,
  getAssignedCollectorForRoute,
  deleteCollectorFromRoute
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

router.get('/assigned/:routeId', getAssignedCollectorForRoute); // Get assigned collector for a route
router.delete('/delete/:routeId', deleteCollectorFromRoute); // Delete collector assignment from route

// Define the route for fetching all assigned routes
router.get("/allAssignedRoutes", getAllAssignedRoutes);

module.exports = router;
