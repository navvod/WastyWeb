import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faPlus,
  faFileCsv // Import the CSV icon
} from "@fortawesome/free-solid-svg-icons";
import './RouteHome.css'; // Import the CSS file

function RouteHome() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9500/route/allroutes" // Update this to your correct API endpoint
        );
        setRoutes(response.data);
      } catch (error) {
        console.error("Error:", error.response.data.error);
      }
    };
    fetchRoutes();
  }, []);

  const handleEdit = (id) => {
    navigate(`/routeManagement/UpdateRoute/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9500/route/deleteroutes/${id}`);
      setRoutes(routes.filter((route) => route.routeId !== id));
      console.log("Route deleted successfully!");
      toast.success("Route deleted successfully!");
    } catch (error) {
      console.error("Error:", error.response.data.error);
    }
  };

  const handleClickNewRoute = () => {
    navigate("/routeManagement/addRoute");
  };

  const handleViewAssignedRoutes = () => {
    navigate("/routeManagement/allAssignedRoutes"); // Navigate to all assigned routes page
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // New function to handle CSV download
  const handleDownloadCSV = () => {
    const csvRows = [];
    // Header row
    csvRows.push('Route ID,Route Name,Starting Point,Ending Point');

    // Data rows
    routes.forEach(route => {
      const row = [
        route.routeId,
        route.routeName,
        route.startingPoint,
        route.endingPoint
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
    link.download = 'Route_List_Report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV is downloading!");
  };

  const handleAssignCollector = (id) => {
    navigate(`/routeManagement/AssignRoute/${id}`);
  };

  const filteredRoutes = routes.filter((route) =>
    Object.values(route).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2 className="text-center">Routes List</h2>
          <div className="search-container">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="btn btn-secondary me-2"
              type="button"
              onClick={handleClickNewRoute}
            >
              <FontAwesomeIcon icon={faPlus} /> Add new Route
            </button>
            <button
              className="btn btn-primary me-2"
              type="button"
              onClick={handleViewAssignedRoutes} // View assigned routes button
            >
              View All Assigned Routes
            </button>
            <button
              className="btn btn-success me-2"
              type="button"
              onClick={handleDownloadCSV} // Download CSV button
            >
              <FontAwesomeIcon icon={faFileCsv} /> Download CSV
            </button>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Route Name</th>
                <th>Starting Point</th>
                <th>Ending Point</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route.routeId}>
                  <td>{route.routeId}</td>
                  <td>{route.routeName}</td>
                  <td>{route.startingPoint}</td>
                  <td>{route.endingPoint}</td>
                  <td>
                    <button
                      className="btn btn-success me-1"
                      onClick={() => handleEdit(route.routeId)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="btn btn-danger me-1"
                      onClick={() => handleDelete(route.routeId)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> Delete
                    </button>
                    <button
                      className="btn btn-info me-1"
                      onClick={() => handleAssignCollector(route.routeId)}
                    >
                      Assign Collector
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

export default RouteHome;
