import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './CollectionHome.css'; // Import your CSS file if needed

function CollectionHome() {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get("http://localhost:9500/waste/collection/all"); // Update this to your correct API endpoint
        setCollections(response.data);
      } catch (error) {
        console.error("Error:", error.response.data.error);
        toast.error("Error fetching collections");
      }
    };
    fetchCollections();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadCSV = () => {
    const csvRows = [];
    // Header row
    csvRows.push('Collector Name,Customer Name,Waste Quantity (kg),Recyclable Quantity (kg),Region,Collection Date');

    // Data rows
    collections.forEach(collection => {
      const row = [
        collection.collectorId?.fullName,
        collection.userId?.fullName,
        collection.wasteQty,
        collection.recyclableQty,
        collection.region,
        new Date(collection.collectionDate).toLocaleDateString()
      ];
      csvRows.push(row.join(','));
    });

    // Convert rows to CSV string
    const csvContent = csvRows.join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Waste_Collection_Report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV is downloading!");
  };

  const handleViewPayment = (userId, collectionId) => {
    navigate(`/payment/viewSingleCollectionPayment/${userId}/${collectionId}`); // Navigate to the payment view route
  };

  // Filtering collections based on search term
  const filteredCollections = collections.filter((collection) =>
    Object.values(collection).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort collections by collection date (latest first)
  const sortedCollections = filteredCollections.sort((a, b) => 
    new Date(b.collectionDate) - new Date(a.collectionDate) // Sort descending
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2 className="text-center">Waste Collections</h2>
          <div className="search-container">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="btn btn-success me-2"
              type="button"
              onClick={handleDownloadCSV}
            >
              <FontAwesomeIcon icon={faFileCsv} /> Download CSV
            </button>
          </div>
          <table id="collection-table" className="table table-striped">
            <thead>
              <tr>
                <th>Collector Name</th>
                <th>Customer Name</th>
                <th>Waste Quantity (kg)</th>
                <th>Recyclable Quantity (kg)</th>
                <th>Region</th>
                <th>Collection Date</th>
                <th>Payment</th> {/* New column for payment button */}
              </tr>
            </thead>
            <tbody>
              {sortedCollections.map((collection) => (
                <tr key={collection._id}> {/* Use _id for MongoDB ID */}
                  <td>{collection.collectorId?.fullName}</td>
                  <td>{collection.userId?.fullName}</td>
                  <td>{collection.wasteQty}</td>
                  <td>{collection.recyclableQty}</td>
                  <td>{collection.region}</td>
                  <td>{new Date(collection.collectionDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewPayment(collection.userId._id, collection._id)} // Pass userId and collectionId
                    >
                      <FontAwesomeIcon icon={faEye} /> View Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CollectionHome;
