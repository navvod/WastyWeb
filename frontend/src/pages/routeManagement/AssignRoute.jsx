import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/AdminSidebar';

function AssignRoute() {
  const { routeId } = useParams();
  const [collectorId, setCollectorId] = useState("");
  const [collectors, setCollectors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const response = await axios.get("http://localhost:9500/user/allCollectors");
        setCollectors(response.data);
      } catch (error) {
        console.error("Error fetching collectors:", error);
        toast.error("Failed to fetch collectors.");
      }
    };
    fetchCollectors();
  }, []);

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
      toast.success("Collector assigned successfully!");
      navigate("/routeManagement/RouteHome");
    } catch (error) {
      console.error("Error assigning collector:", error);
      toast.error("Failed to assign collector.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', flexShrink: 0, backgroundColor: '#f8f9fa' }}>
        <AdminSidebar />
      </div>

      <div style={{ flexGrow: 1, padding: '50px 20px', marginLeft: '20px', backgroundColor: '#ffffff' }}>
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-black rounded-sm"
        >
          Back
        </button>
        <h2 className="text-2xl font-semibold text-[#333] mb-4">Assign Collector to Route</h2>
        <form onSubmit={handleAssign} className="space-y-4 font-[sans-serif] text-[#333]">
          <div>
            <label htmlFor="routeId" className="block text-sm mb-2">Route ID</label>
            <input
              type="text"
              id="routeId"
              value={routeId || ""}
              readOnly
              className="px-4 py-3 bg-gray-100 w-full text-sm outline-[#333] rounded-sm transition-all"
            />
          </div>
          <div>
            <label htmlFor="collectorId" className="block text-sm mb-2">Select Collector</label>
            <select
              id="collectorId"
              value={collectorId}
              onChange={(e) => setCollectorId(e.target.value)}
              required
              className="px-4 py-3 bg-gray-100 w-full text-sm outline-[#333] rounded-sm transition-all"
            >
              <option value="">-- Select Collector --</option>
              {collectors.map((collector) => (
                <option key={collector._id} value={collector.Id}>
                  {collector.Id} - {collector.fullName}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2.5 text-sm bg-[#333] hover:bg-[#222] text-white rounded-sm"
          >
            Assign Collector
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AssignRoute;
