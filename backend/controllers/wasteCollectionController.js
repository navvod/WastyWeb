// controllers/WasteCollectionController.js
const WasteCollection = require("../models/wasteCollectionModel.js");
const User = require("../models/userModel.js");

// Function to submit waste collectionconst submitWasteCollection = async (req, res) => {
    const submitWasteCollection = async (req, res) => {
        const { userId, collectorId, wasteQty, recyclableQty, region } = req.body;
      
        try {
          // Validate input
          if (!userId || !collectorId || !wasteQty || recyclableQty === undefined || !region) {
            return res.status(400).json({ error: "Please include all required fields" });
          }
      
          // Find the user by custom Id field
          const user = await User.findOne({ Id: userId });
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
      
          // Find the collector by custom Id field and check if the role is 'Collector'
          const collector = await User.findOne({ Id: collectorId, role: "Collector" });
          if (!collector) {
            return res.status(404).json({ error: "Collector not found or is not a collector" });
          }
      
          // Create a new waste collection entry
          const wasteCollection = new WasteCollection({
            userId: user._id, // Using MongoDB's ObjectId for user reference
            collectorId: collector._id, // Using MongoDB's ObjectId for collector reference
            wasteQty,
            recyclableQty,
            customerId: userId, // Save the custom customer ID
            region, // Save the region
          });
      
          // Save waste collection entry
          await wasteCollection.save();
      
          // Example: Calculate payment (you can adjust the logic)
          const payment = calculatePayment(wasteQty, recyclableQty);
      
          res.status(200).json({
            message: "Waste collection submitted successfully",
            user: {
              id: user.Id,
              fullName: user.fullName,
              wasteQty,
              recyclableQty,
              region,
              collectionDate: wasteCollection.collectionDate, // Auto-saved collection date
              payment,
            },
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to submit waste collection" });
        }
      };
      

// Function to calculate payment based on waste collected
const calculatePayment = async (req, res) => {
  const { userId } = req.params; // Custom user ID, e.g., "CU1998"

  try {
    // Fetch all waste collection records for the user using the custom userId
    const wasteRecords = await WasteCollection.find({ customerId: userId }); // Use customerId here

    if (wasteRecords.length === 0) {
      return res.status(404).json({ error: "No waste collection records found for this user" });
    }

    // Calculate total waste and recyclable waste
    const totalWaste = wasteRecords.reduce((acc, record) => acc + record.wasteQty, 0);
    const totalRecyclable = wasteRecords.reduce((acc, record) => acc + record.recyclableQty, 0);

    // Calculate payment based on rates
    const wasteRate = 10; // Example rate per unit of waste
    const recyclableRate = 2; // Example rate per unit of recyclable waste

    const payment = (totalWaste * wasteRate) - (totalRecyclable * recyclableRate);

    res.status(200).json({
      message: "Payment calculated successfully",
      userId,
      totalWaste,
      totalRecyclable,
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate payment" });
  }
};

// Function to calculate total payment for the user within a specific month
const calculateMonthlyPayment = async (req, res) => {
    const { userId, month, year } = req.params; // Expecting month and year as parameters
  
    try {
      // Start and end dates for the month
      const startDate = new Date(year, month - 1, 1); // month - 1 because months are 0-indexed
      const endDate = new Date(year, month, 0); // Get the last day of the month
  
      // Fetch all waste collection records for the user within the specified date range
      const wasteRecords = await WasteCollection.find({
        customerId: userId,
        collectionDate: { $gte: startDate, $lt: endDate }
      });
  
      if (wasteRecords.length === 0) {
        return res.status(404).json({ error: "No waste collection records found for this user in the specified month" });
      }
  
      // Calculate total waste and recyclable waste
      const totalWaste = wasteRecords.reduce((acc, record) => acc + record.wasteQty, 0);
      const totalRecyclable = wasteRecords.reduce((acc, record) => acc + record.recyclableQty, 0);
  
      // Calculate payment based on rates
      const wasteRate = 5; // Example rate per unit of waste
      const recyclableRate = 10; // Example rate per unit of recyclable waste
  
      const payment = (totalWaste * wasteRate) - (totalRecyclable * recyclableRate);
  
      res.status(200).json({
        message: "Monthly payment calculated successfully",
        userId,
        totalWaste,
        totalRecyclable,
        payment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to calculate monthly payment" });
    }
  };



//  REPORT SECTION

// Function to generate daily/weekly/monthly collection reports
const generateCollectionReport = async (req, res) => {
    const { type, region } = req.query; // e.g., 'daily', 'weekly', 'monthly'
    const { startDate, endDate } = req.body; // Date range for filtering (optional)
  
    try {
      // Build the date range for the query based on report type
      let start, end;
  
      if (type === "daily") {
        start = new Date();
        start.setHours(0, 0, 0, 0); // Set to beginning of today
        end = new Date();
        end.setHours(23, 59, 59, 999); // Set to end of today
      } else if (type === "weekly") {
        start = new Date();
        start.setDate(start.getDate() - 7); // Last 7 days
        end = new Date();
      } else if (type === "monthly") {
        start = new Date();
        start.setDate(1); // Start of the current month
        end = new Date();
      } else if (startDate && endDate) {
        // Use provided start and end dates if given
        start = new Date(startDate);
        end = new Date(endDate);
      } else {
        return res.status(400).json({ error: "Invalid report type or missing date range." });
      }
  
      // Build the query object
      const query = {
        collectionDate: { $gte: start, $lt: end },
      };
  
      if (region) {
        query.region = region; // Filter by region if provided
      }
  
      // Fetch the waste collection data within the date range
      const wasteRecords = await WasteCollection.find(query);
  
      // Calculate the total waste and recyclable waste
      const totalWaste = wasteRecords.reduce((acc, record) => acc + record.wasteQty, 0);
      const totalRecyclable = wasteRecords.reduce((acc, record) => acc + record.recyclableQty, 0);
  
      // Group data by date or region
      const reportData = wasteRecords.reduce((acc, record) => {
        const key = type === "region" ? record.region : record.collectionDate.toISOString().split("T")[0];
        if (!acc[key]) {
          acc[key] = { totalWaste: 0, totalRecyclable: 0 };
        }
        acc[key].totalWaste += record.wasteQty;
        acc[key].totalRecyclable += record.recyclableQty;
        return acc;
      }, {});
  
      res.status(200).json({
        message: `Collection report generated for ${type}`,
        reportType: type,
        totalWaste,
        totalRecyclable,
        reportData, // Contains breakdown by date or region
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate collection report" });
    }
  };
  


// Function to calculate recycling rate
const calculateRecyclingRate = async (startDate, endDate) => {
  const wasteData = await WasteCollection.find({
    collectionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });

  console.log("Waste Data Retrieved:", wasteData);

  let totalWaste = 0;
  let totalRecyclable = 0;

  wasteData.forEach((entry) => {
    totalWaste += entry.wasteQty;
    totalRecyclable += entry.recyclableQty;
  });

  const recyclingRate = totalWaste ? (totalRecyclable / totalWaste) * 100 : 0; // Calculate recycling rate as a percentage

  return {
    totalWaste,
    totalRecyclable,
    recyclingRate: recyclingRate.toFixed(2), // Limit to 2 decimal places
  };
};

// Controller function for the recycling rate report
const generateRecyclingRateReport = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const report = await calculateRecyclingRate(startDate, endDate);
    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating recycling rate report", error });
  }
};

// Function to generate the high waste areas report
const generateHighWasteAreasReport = async (req, res) => {
  try {
    // Grouping waste collections by region and summing up the waste quantities
    const report = await WasteCollection.aggregate([
      {
        $group: {
          _id: "$region", // Group by region
          totalWaste: { $sum: "$wasteQty" }, // Sum of waste quantities for each region
        },
      },
      {
        $sort: { totalWaste: -1 }, // Sort by total waste in descending order
      },
    ]);

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating high waste areas report", error });
  }
};

//chart

// Endpoint to get daily or monthly waste collected over time
const getWasteCollectedOverTime = async (req, res) => {
    const { startDate, endDate } = req.query;  // Dates are expected in the query parameters
  
    try {
      // Validate if startDate and endDate are provided
      if (!startDate || !endDate) {
        return res.status(400).json({ error: "Please provide startDate and endDate" });
      }
  
      // Perform aggregation to group waste collection data by date
      const wasteData = await WasteCollection.aggregate([
        {
          $match: {
            collectionDate: { 
              $gte: new Date(startDate),  // Ensure it's greater or equal to the start date
              $lte: new Date(endDate)     // Ensure it's less or equal to the end date
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$collectionDate" } }, // Group by date (formatted as YYYY-MM-DD)
            totalWaste: { $sum: "$wasteQty" },  // Sum of waste quantities for each date
            totalRecyclable: { $sum: "$recyclableQty" },  // Sum of recyclable quantities for each date
          }
        },
        {
          $sort: { _id: 1 } // Sort by date in ascending order
        }
      ]);
  
      // Respond with the aggregated waste data
      res.status(200).json(wasteData);
    } catch (error) {
      console.error("Error fetching waste data over time:", error);
      res.status(500).json({ error: "Failed to fetch waste data" });
    }
  };


  // Endpoint to get waste collected by region
const getWasteCollectedByRegion = async (req, res) => {
    const { startDate, endDate } = req.query;  // Dates are expected in the query parameters
  
    try {
      // Validate if startDate and endDate are provided
      if (!startDate || !endDate) {
        return res.status(400).json({ error: "Please provide startDate and endDate" });
      }
  
      // Perform aggregation to group waste collection data by region
      const wasteDataByRegion = await WasteCollection.aggregate([
        {
          $match: {
            collectionDate: { 
              $gte: new Date(startDate),  // Ensure it's greater or equal to the start date
              $lte: new Date(endDate)     // Ensure it's less or equal to the end date
            }
          }
        },
        {
          $group: {
            _id: "$region",  // Group by the region field
            totalWaste: { $sum: "$wasteQty" },  // Sum of waste quantities for each region
            totalRecyclable: { $sum: "$recyclableQty" },  // Sum of recyclable quantities for each region
          }
        },
        {
          $sort: { totalWaste: -1 } // Sort by total waste in descending order
        }
      ]);
  
      // Respond with the aggregated waste data by region
      res.status(200).json(wasteDataByRegion);
    } catch (error) {
      console.error("Error fetching waste data by region:", error);
      res.status(500).json({ error: "Failed to fetch waste data by region" });
    }
  };

  // Endpoint to get recyclable vs non-recyclable waste data
const getRecyclableVsNonRecyclableWaste = async (req, res) => {
    const { startDate, endDate } = req.query;  // Dates are expected in the query parameters
  
    try {
      // Validate if startDate and endDate are provided
      if (!startDate || !endDate) {
        return res.status(400).json({ error: "Please provide startDate and endDate" });
      }
  
      // Perform aggregation to sum the total recyclable and non-recyclable waste
      const wasteData = await WasteCollection.aggregate([
        {
          $match: {
            collectionDate: {
              $gte: new Date(startDate),  // Start date
              $lte: new Date(endDate),    // End date
            },
          },
        },
        {
          $group: {
            _id: null,  // We don't need to group by any field, just aggregate all data
            totalRecyclable: { $sum: "$recyclableQty" },  // Sum of recyclable waste
            totalWaste: { $sum: "$wasteQty" },  // Sum of total waste
          },
        },
        {
          $project: {
            _id: 0,  // Exclude the _id field from the result
            totalRecyclable: 1,
            totalNonRecyclable: { $subtract: ["$totalWaste", "$totalRecyclable"] },  // Calculate non-recyclable waste
          },
        },
      ]);
  
      // If no data found for the date range
      if (wasteData.length === 0) {
        return res.status(404).json({ message: "No waste data found for the given date range" });
      }
  
      // Return the aggregated data
      res.status(200).json(wasteData[0]);  // Return the first (and only) result
    } catch (error) {
      console.error("Error fetching recyclable vs non-recyclable waste:", error);
      res.status(500).json({ error: "Failed to fetch waste data" });
    }
  };
  
  
  
module.exports = {
  submitWasteCollection,
  calculatePayment,
  calculateMonthlyPayment,
  generateCollectionReport,
  generateHighWasteAreasReport,
  generateRecyclingRateReport,
  getWasteCollectedOverTime,
  getWasteCollectedByRegion,
  getRecyclableVsNonRecyclableWaste,
};
