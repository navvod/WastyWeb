import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/AdminSidebar'; // Adjust the path as necessary

const initialState = {
  routeName: "",
  startingPoint: "",
  endingPoint: "",
};

function UpdateRoute() {
  const { id } = useParams(); // Get the route ID from the URL parameters
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await axios.get(`http://localhost:9500/route/getroutes/${id}`);
        console.log("Fetched data:", response.data); // Log the fetched data

        if (response.data) {
          setFormData({
            routeName: response.data.routeName || "", // Ensure correct field names
            startingPoint: response.data.startingPoint || "",
            endingPoint: response.data.endingPoint || "",
          });
        }
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching route:", error);
        toast.error("Failed to fetch route details");
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchRoute(); // Call the fetch function to get route details
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.put(`http://localhost:9500/route/updateroutes/${id}`, formData);
      toast.success("Route updated successfully!");
      navigate(`/routeManagement/RouteHome`);
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      toast.error("Failed to update route");
    }
  };

  const validateForm = () => {
    const { routeName, startingPoint, endingPoint } = formData;
    if (!routeName || !startingPoint || !endingPoint) {
      toast.error("All fields are required.");
      return false;
    }
    return true;
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Admin Sidebar */}
      <div style={{ width: '250px', flexShrink: 0, backgroundColor: '#f8f9fa' }}>
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, padding: '50px 20px', marginLeft: '20px', backgroundColor: '#ffffff' }}>
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-black rounded-sm"
        >
          Back
        </button>
        <h1 className="text-2xl font-semibold text-[#333] mb-4">Update Route</h1>
        <form onSubmit={handleSubmit} className="space-y-4 font-[sans-serif] text-[#333]">
          <input
            type="text"
            placeholder="Route Name"
            name="routeName"
            value={formData.routeName}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            required
          />
          <input
            type="text"
            placeholder="Starting Point"
            name="startingPoint"
            value={formData.startingPoint}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            required
          />
          <input
            type="text"
            placeholder="Ending Point"
            name="endingPoint"
            value={formData.endingPoint}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            required
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2.5 text-sm bg-[#333] hover:bg-[#222] text-white rounded-sm"
          >
            Update Route
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default UpdateRoute;
