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

const getAssignedCollectorForRoute = expressAsyncHandler(async (req, res) => {
  const { routeId } = req.params;

  try {
    // Find the route with the assigned collector
    const route = await Route.findOne({ routeId })
      .populate("collectorId", "Id fullName contactNumber") // Populate the collector details
      .select("routeId collectorId");

    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.status(200).json({
      routeId: route.routeId,
      collectorId: route.collectorId ? route.collectorId.Id : null,
      fullName: route.collectorId ? route.collectorId.fullName : null,
      contactNumber: route.collectorId ? route.collectorId.contactNumber : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assigned collector" });
  }
});

const deleteCollectorFromRoute = expressAsyncHandler(async (req, res) => {
  const { routeId } = req.params;

  try {
    // Find the route
    const route = await Route.findOne({ routeId });
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    // Remove the collector assignment
    route.collectorId = null; // Assuming you want to clear the assignment
    await route.save();

    res.status(200).json({ message: "Collector assignment removed successfully", route });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove collector from route" });
  }
});


const getAllAssignedRoutes = expressAsyncHandler(async (req, res) => {
  try {
    // Fetch all routes with assigned collectors
    const assignedRoutes = await Route.find({ collectorId: { $exists: true, $ne: null } })
      .select("routeId collectorId"); // Only select the fields you need

    if (!assignedRoutes.length) {
      return res.status(404).json({ message: "No assigned routes found" });
    }

    // Manually retrieve user details for each assigned route based on the Id field
    const response = await Promise.all(assignedRoutes.map(async (route) => {
      const collector = await User.findOne({ Id: route.collectorId }).select("Id fullName contactNumber"); // Use findOne to match the Id string
      return {
        routeId: route.routeId,
        collectorId: collector ? collector.Id : null,
        fullName: collector ? collector.fullName : null,
        contactNumber: collector ? collector.contactNumber : null,
      };
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching assigned routes:", error);
    res.status(500).json({ error: "Failed to fetch assigned routes" });
  }
});





// Exporting the functions
module.exports = {
  addRoute,
  updateRoute,
  getRouteById,
  getAllRoutes,
  deleteRoute,
  assignCollectorToRoute,
  getAssignedCollectorForRoute,
  deleteCollectorFromRoute,
  getAllAssignedRoutes,
};
