import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/AdminSidebar'; // Adjust the path as necessary

const initialState = {
  routeName: "",
  startingPoint: "",
  endingPoint: "",
};

function AddRoute() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);

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
      await axios.post("http://localhost:9500/route/addroutes", formData);
      toast.success("Route added successfully!");
      setFormData(initialState);
      navigate(`/routeManagement/RouteHome`);
    } catch (error) {
      console.error("Error:", error.response?.data?.error);
      toast.error("Failed to add route");
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
    navigate(-1); // Navigates back to the previous page
  };

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
        <h1 className="text-2xl font-semibold text-[#333] mb-4">Add New Route</h1>
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
            Add Route
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AddRoute;
