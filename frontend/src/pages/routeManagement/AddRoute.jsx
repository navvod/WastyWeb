import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Make sure to install and import toastify for notifications
import './AddRoute.css'; // Import the CSS file

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
    if (!validateForm()) return; // Validate form before submission
    try {
      const response = await axios.post(
        "http://localhost:9500/route/addroutes", // Adjust this URL as necessary
        formData
      );
      toast.success("Route added successfully!"); // Display success toast message
      setFormData(initialState); // Reset form fields using initialState
      navigate(`/routeManagement/RouteHome`); // Redirect to the routes page or adjust as needed
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error("Failed to add route"); // Display error toast message
    }
  };

  const validateForm = () => {
    const { routeName, startingPoint, endingPoint } = formData;

    // Check if all fields are filled out
    if (!routeName || !startingPoint || !endingPoint) {
      toast.error("All fields are required.");
      return false;
    }

    return true; // Return true if all validations pass
  };

  return (
    <div className="container">
      <h1 className="title">Add New Route</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label className="label" htmlFor="routeName">
            Route Name
          </label>
          <input
            type="text"
            id="routeName"
            name="routeName"
            value={formData.routeName}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label className="label" htmlFor="startingPoint">
            Starting Point
          </label>
          <input
            type="text"
            id="startingPoint"
            name="startingPoint"
            value={formData.startingPoint}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label className="label" htmlFor="endingPoint">
            Ending Point
          </label>
          <input
            type="text"
            id="endingPoint"
            name="endingPoint"
            value={formData.endingPoint}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <button type="submit" className="button">
          Add Route
        </button>
      </form>
    </div>
  );
}

export default AddRoute;
