
const express = require("express");
const {getAllWasteCollections,getRecyclableVsNonRecyclableWaste, getWasteCollectedByRegion ,getWasteCollectedOverTime ,generateRecyclingRateReport ,submitWasteCollection, viewSingleCollectionPayment, calculateMonthlyCollectionDetails,generateCollectionReport,generateHighWasteAreasReport,getAllCollectionsForCustomer,calculateTotalAmountAndPaybacks } = require("../controllers/wasteCollectionController.js");

const router = express.Router();

// Route to submit waste collection
router.post("/submitWaste", submitWasteCollection);

router.get('/collection/all', getAllWasteCollections); // Route for getting all collections

// Admin route to calculate payment for a user
router.get("/payment/viewSingleCollectionPayment/:customerId/:collectionId", viewSingleCollectionPayment);


router.get('/payment/calculate-monthly-payment/:userId/:month/:year', calculateMonthlyCollectionDetails);

// Route for generating collection reports (daily, weekly, monthly)
router.get("/wasteCollection/report", generateCollectionReport);

 // POST route for recycling rate report
router.post('/wasteCollection/recyclingRateReport', generateRecyclingRateReport);

// Define the endpoint for the high waste areas report
router.get("/wasteCollection/highWasteAreasReport", generateHighWasteAreasReport);


// Define the route to fetch waste data over time
router.get('/wasteCollection/wasteOvertime', getWasteCollectedOverTime);

// Define the route to fetch waste data by region
router.get('/wasteCollection/byRegion', getWasteCollectedByRegion);

// Define the route to fetch recyclable vs non-recyclable waste
router.get("/wasteCollection/recyclableVsNonRecyclable", getRecyclableVsNonRecyclableWaste);

// Get all waste collections for a specific customer
router.get('/:customerId/collections', getAllCollectionsForCustomer);

// Calculate total payment and paybacks for recycled waste for a specific customer
router.get('/:customerId/payments', calculateTotalAmountAndPaybacks);

module.exports = router;
