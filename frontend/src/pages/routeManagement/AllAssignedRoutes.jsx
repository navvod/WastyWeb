import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function AllAssignedRoutes() {
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedRoutes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9500/route/allAssignedRoutes" // Update this to your correct API endpoint
        );
        setAssignedRoutes(response.data);
      } catch (error) {
        console.error("Error:", error.response.data.error);
        toast.error("Failed to fetch assigned routes!");
      }
    };
    fetchAssignedRoutes();
  }, []);

  const handleBack = () => {
    navigate("/routeManagement/RouteHome"); // Navigate back to the Route Management page
  };

  const handleDeleteCollector = async (routeId) => {
    try {
      const response = await axios.delete(`http://localhost:9500/route/delete/${routeId}`); // Update this to your correct API endpoint
      toast.success(response.data.message);
      setAssignedRoutes(assignedRoutes.filter(route => route.routeId !== routeId)); // Update the local state
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error("Failed to remove collector from route!");
    }
  };

  // Function to convert data to CSV and trigger download
  const handleDownloadCSV = () => {
    const csvData = [
      ["Route ID", "Assigned Collector ID", "Collector Full Name", "Collector Contact Number"],
      ...assignedRoutes.map(route => [
        route.routeId,
        route.collectorId,
        route.fullName,
        route.contactNumber ? route.contactNumber.toString() : "N/A", // Ensure contact number is displayed correctly
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvData.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "assigned_routes.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the file
    document.body.removeChild(link); // Clean up
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2 className="text-center">Assigned Routes</h2>
          <button className="btn btn-secondary mb-3" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Route Management
          </button>
          <button className="btn btn-primary mb-3" onClick={handleDownloadCSV}>
            Download CSV
          </button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Assigned Collector ID</th>
                <th>Collector Full Name</th>
                <th>Collector Contact Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedRoutes.length > 0 ? (
                assignedRoutes.map((route) => (
                  <tr key={route.routeId}>
                    <td>{route.routeId}</td>
                    <td>{route.collectorId}</td>
                    <td>{route.fullName}</td>
                    <td>{route.contactNumber ? route.contactNumber.toString() : "N/A"}</td> {/* Displaying contact number */}
                    <td>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDeleteCollector(route.routeId)}
                      >
                        Delete Collector
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No assigned routes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AllAssignedRoutes;
