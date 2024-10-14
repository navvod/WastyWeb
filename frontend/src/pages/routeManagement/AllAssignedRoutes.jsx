import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFileCsv, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "../../components/AdminSidebar";
import 'react-toastify/dist/ReactToastify.css';

function AllAssignedRoutes() {
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:9500/route/allAssignedRoutes");
        setAssignedRoutes(response.data);
      } catch (error) {
        console.error("Error:", error.response?.data?.error);
        toast.error("Failed to fetch assigned routes!");
      }
    };
    fetchAssignedRoutes();
  }, []);

  const handleBack = () => {
    navigate("/routeManagement/RouteHome");
  };

  const handleDeleteCollector = async (routeId) => {
    try {
      await axios.delete(`http://localhost:9500/route/delete/${routeId}`);
      setAssignedRoutes(assignedRoutes.filter(route => route.routeId !== routeId));
      toast.success("Collector removed from route successfully!");
    } catch (error) {
      console.error("Error:", error.response?.data?.error);
      toast.error("Failed to remove collector from route!");
    }
  };

  const handleDownloadCSV = () => {
    const csvData = [
      ["Route ID", "Assigned Collector ID", "Collector Full Name", "Collector Contact Number"],
      ...assignedRoutes.map(route => [
        route.routeId,
        route.collectorId,
        route.fullName,
        route.contactNumber || "N/A",
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "assigned_routes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV is downloading!");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", flexShrink: 0, backgroundColor: "#f8f9fa" }}>
        <AdminSidebar />
      </div>
      <div style={{ flexGrow: 1, padding: "50px 20px", backgroundColor: "#ffffff" }}>
        <div className="flex items-center justify-between mb-4">
          <button
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Route Management
          </button>
          <button
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300"
            onClick={handleDownloadCSV}
          >
            <FontAwesomeIcon icon={faFileCsv} /> Download CSV
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-4">Assigned Routes</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Route ID</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Assigned Collector ID</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Collector Full Name</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Contact Number</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignedRoutes.length > 0 ? (
                assignedRoutes.map((route) => (
                  <tr key={route.routeId}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{route.routeId}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{route.collectorId}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{route.fullName}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{route.contactNumber || "N/A"}</td>
                    <td className="py-3 px-4">
                      <button
                        className="select-none rounded-lg border border-red-600 py-2 px-4 text-xs font-bold uppercase text-red-600 transition-all hover:opacity-75 focus:ring focus:ring-red-300"
                        onClick={() => handleDeleteCollector(route.routeId)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} /> Remove Collector
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">No assigned routes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AllAssignedRoutes;
