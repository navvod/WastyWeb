import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AssignRoute() {
  const { routeId } = useParams(); // Get routeId from the URL
  const [collectorId, setCollectorId] = useState("");
  const [collectors, setCollectors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Route ID:", routeId); // Check if routeId is correctly passed
  }, [routeId]);

  // Fetch available collectors when component mounts
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const response = await axios.get("http://localhost:9500/user/allCollectors"); // API to fetch all collectors
        setCollectors(response.data); // Set collectors from response
      } catch (error) {
        console.error("Error fetching collectors:", error);
        toast.error("Failed to fetch collectors.");
      }
    };
    fetchCollectors();
  }, []);

  // Handle the assign action
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!collectorId) {
      toast.error("Please select a collector.");
      return;
    }

    try {
      await axios.post("http://localhost:9500/route/assignCollector", {
        routeId,
        collectorId,
      });
      toast.success("Collector assigned successfully!"); // Success message
      navigate("/routeManagement/RouteHome"); // Redirect to route management after assignment
    } catch (error) {
      console.error("Error assigning collector:", error);
      toast.error("Failed to assign collector.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Assign Collector to Route</h2>
      <form onSubmit={handleAssign}>
        {/* Display the Route ID, passed via URL */}
        <div className="mb-3">
          <label htmlFor="routeId" className="form-label">Route ID</label>
          <input
            type="text"
            id="routeId"
            className="form-control"
            value={routeId || ""}
            readOnly
          />
        </div>

        {/* Dropdown for selecting the collector */}
        <div className="mb-3">
          <label htmlFor="collectorId" className="form-label">Select Collector</label>
          <select
            id="collectorId"
            className="form-select"
            value={collectorId}
            onChange={(e) => setCollectorId(e.target.value)}
            required
          >
            <option value="">-- Select Collector --</option>
            {collectors.map((collector) => (
              <option key={collector._id} value={collector.Id}>
                {collector.Id} {/* Display custom collector Id */}
              </option>
            ))}
          </select>
        </div>

        {/* Assign button */}
        <button type="submit" className="btn btn-primary">
          Assign Collector
        </button>
      </form>
    </div>
  );
}

export default AssignRoute;
