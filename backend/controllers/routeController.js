const expressAsyncHandler = require('express-async-handler');
const Route = require('../models/routeModel.js'); // Ensure this path is correct based on your project structure
const User = require('../models/userModel'); // Path to your User model

// Function to generate a unique route ID
const generateRouteId = async () => {
  let newId;
  do {
    // Generate a random four-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    newId = "RT" + randomNum.toString();
  } while (await Route.findOne({ routeId: newId })); // Check if the generated ID already exists
  return newId;
};

// Add a new route
const addRoute = expressAsyncHandler(async (req, res) => {
  const { routeName, startingPoint, endingPoint } = req.body;

  try {
    // Validate the input
    if (!routeName || !startingPoint || !endingPoint) {
      return res.status(400).json({ error: "Please include all fields" });
    }

    // Generate a unique route ID
    const routeId = await generateRouteId(); // Generate the unique ID

    // Create a new route
    const newRoute = new Route({
      routeId, // Assign the generated ID here
      routeName,
      startingPoint,
      endingPoint,
    });

    await newRoute.save();
    res.status(201).json({ message: "Route added successfully", newRoute });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add route" });
  }
});

// Update a route by routeId
const updateRoute = expressAsyncHandler(async (req, res) => {
  const routeId = req.params.routeId; // Assuming the routeId is passed as a URL parameter
  const { routeName, startingPoint, endingPoint } = req.body;

  try {
    // Find the route by routeId
    const route = await Route.findOne({ routeId });

    // Check if the route exists
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    // Update route fields
    if (routeName) route.routeName = routeName;
    if (startingPoint) route.startingPoint = startingPoint;
    if (endingPoint) route.endingPoint = endingPoint;

    await route.save();
    res.status(200).json({ message: "Route updated successfully", route });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update route" });
  }
});

// Get route by routeId
const getRouteById = expressAsyncHandler(async (req, res) => {
  const routeId = req.params.routeId; // Assuming the routeId is passed as a URL parameter

  try {
    const route = await Route.findOne({ routeId });

    // Check if the route exists
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.status(200).json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

// Get all routes
const getAllRoutes = expressAsyncHandler(async (req, res) => {
  try {
    const routes = await Route.find(); // Fetch all routes
    res.status(200).json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// Delete a route by routeId
const deleteRoute = expressAsyncHandler(async (req, res) => {
  const routeId = req.params.routeId; // Assuming the routeId is passed as a URL parameter

  try {
    const deletedRoute = await Route.findOneAndDelete({ routeId });

    // Check if the route exists
    if (!deletedRoute) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete route" });
  }
});

const assignCollectorToRoute = expressAsyncHandler(async (req, res) => {
  const { routeId, collectorId } = req.body;

  try {
    // Validate input
    if (!routeId || !collectorId) {
      return res.status(400).json({ error: "Please include routeId and collectorId" });
    }

    // Find the route
    const route = await Route.findOne({ routeId });
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    // Find the collector by collectorId
    const collector = await User.findOne({ Id: collectorId, role: "Collector" });
    if (!collector) {
      return res.status(404).json({ error: "Collector not found or is not a collector" });
    }

    // Assign collectorId to the route
    route.collectorId = collector.Id; // Assuming you want to save the collector's Id
    await route.save();

    res.status(200).json({ message: "Collector assigned to route successfully", route });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign collector to route" });
  }
});





// Exporting the functions
module.exports = {
  addRoute,
  updateRoute,
  getRouteById,
  getAllRoutes,
  deleteRoute,
  assignCollectorToRoute
};
