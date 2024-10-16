import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CollectorSidebar from '../../components/collector/CollectorSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CollectorAssignedRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const collectorId = localStorage.getItem('collectorId');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get(`/route/${collectorId}/routes`);
        setRoutes(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch assigned routes');
        setLoading(false);
      }
    };
    fetchRoutes();
  }, [collectorId]);

  const handleComplete = async (routeId) => {
    if (window.confirm("Are you sure you want to mark this route as completed?")) {
      try {
        await axios.delete(`http://localhost:9500/route/delete/${routeId}`);
        setRoutes(routes.filter(route => route.routeId !== routeId));
        toast.success("Route marked as completed and deleted");
      } catch (error) {
        toast.error("Failed to delete route");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <CollectorSidebar />

      <div className="flex-grow p-6 bg-gray-100 lg:ml-128 lg:p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">My Assigned Routes</h1>
        <ToastContainer />

        {loading ? (
          <p>Loading assigned routes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul>
              {routes.map((route) => (
                <li key={route.routeId} className="mb-4 border-b pb-4">
                  <h2 className="text-xl font-bold">{route.routeName}</h2>
                  <p><strong>Starting Point:</strong> {route.startingPoint}</p>
                  <p><strong>Ending Point:</strong> {route.endingPoint}</p>
                  <button
                    onClick={() => handleComplete(route.routeId)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Completed
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectorAssignedRoutes;
