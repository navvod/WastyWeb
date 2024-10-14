import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus, faFileCsv } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "../../components/AdminSidebar";

function RouteHome() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:9500/route/allroutes");
        setRoutes(response.data);
      } catch (error) {
        console.error("Error:", error.response?.data?.error);
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
      toast.success("Route deleted successfully!");
    } catch (error) {
      console.error("Error:", error.response?.data?.error);
      toast.error("Failed to delete route.");
    }
  };

  const handleClickNewRoute = () => {
    navigate("/routeManagement/addRoute");
  };

  const handleViewAssignedRoutes = () => {
    navigate("/routeManagement/allAssignedRoutes");
  };

  const handleAssignCollector = (id) => {
    navigate(`/routeManagement/AssignRoute/${id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadCSV = () => {
    const csvRows = [];
    csvRows.push('Route ID,Route Name,Starting Point,Ending Point');

    routes.forEach(route => {
      const row = [route.routeId, route.routeName, route.startingPoint, route.endingPoint];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
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

  const filteredRoutes = routes.filter((route) =>
    Object.values(route).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", flexShrink: 0, backgroundColor: "#f8f9fa" }}>
        <AdminSidebar />
      </div>
      <div style={{ flexGrow: 1, padding: "100px 20px 20px", backgroundColor: "#ffffff" }}>
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5 className="block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900">
              Routes List
            </h5>
            <p className="block mt-1 font-sans text-base font-normal leading-relaxed text-gray-700">
              View and manage all routes
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300"
              onClick={handleDownloadCSV}
            >
              <FontAwesomeIcon icon={faFileCsv} /> Download CSV
            </button>
            <button
              className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg"
              onClick={handleClickNewRoute}
            >
              <FontAwesomeIcon icon={faPlus} /> Add New Route
            </button>
            <button
              className="flex select-none items-center gap-3 rounded-lg bg-blue-600 py-2 px-4 text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg"
              onClick={handleViewAssignedRoutes}
            >
              View All Assigned Routes
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table id="route-table" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Route ID</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Route Name</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Starting Point</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Ending Point</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRoutes.map((route) => (
                <tr key={route.routeId}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{route.routeId}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{route.routeName}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{route.startingPoint}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{route.endingPoint}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                      <button
                        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50"
                        title="Edit Route"
                        onClick={() => handleEdit(route.routeId)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50"
                        title="Delete Route"
                        onClick={() => handleDelete(route.routeId)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                  
                    </span>
                    <span className="ml-2 inline-flex overflow-hidden rounded-md border bg-white shadow-sm">

                    <button
                        className="inline-block p-3 text-gray-700 hover:bg-gray-50"
                        title="Assign Collector"
                        onClick={() => handleAssignCollector(route.routeId)}
                      >
                        Assign Collector
                      </button>
                      </span>

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
