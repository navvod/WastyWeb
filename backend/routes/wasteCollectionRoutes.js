
const express = require("express");
const {getRecyclableVsNonRecyclableWaste, getWasteCollectedByRegion ,getWasteCollectedOverTime ,generateRecyclingRateReport ,submitWasteCollection, calculatePayment, calculateMonthlyPayment,generateCollectionReport,generateHighWasteAreasReport } = require("../controllers/wasteCollectionController.js");

const router = express.Router();

// Route to submit waste collection
router.post("/submitWaste", submitWasteCollection);

// Admin route to calculate payment for a user
router.get("/calculatePayment/:userId", calculatePayment);


router.get('/calculate-monthly-payment/:userId/:month/:year', calculateMonthlyPayment);

// Route for generating collection reports (daily, weekly, monthly)
router.get("/wasteCollection/report", generateCollectionReport);

 // POST route for recycling rate report
router.post('/wasteCollection/recyclingRateReport', generateRecyclingRateReport);

// Define the endpoint for the high waste areas report
router.post("/wasteCollection/highWasteAreasReport", generateHighWasteAreasReport);


// Define the route to fetch waste data over time
router.get('/wasteCollection/wasteOvertime', getWasteCollectedOverTime);

// Define the route to fetch waste data by region
router.get('/wasteCollection/byRegion', getWasteCollectedByRegion);

// Define the route to fetch recyclable vs non-recyclable waste
router.get("/wasteCollection/recyclableVsNonRecyclable", getRecyclableVsNonRecyclableWaste);

module.exports = router;
