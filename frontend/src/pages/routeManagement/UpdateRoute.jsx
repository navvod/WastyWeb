import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Ensure you have toastify installed
import './AddRoute.css'; // Import the same CSS file

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
    if (!validateForm()) return; // Validate form before submission
    try {
      await axios.put(
        `http://localhost:9500/route/updateroutes/${id}`, // Adjust this URL as necessary
        formData
      );
      toast.success("Route updated successfully!"); // Display success toast message
      navigate(`/routeManagement/RouteHome`); // Redirect to the routes page or adjust as needed
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      toast.error("Failed to update route"); // Display error toast message
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

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <div className="container">
      <h1 className="title">Update Route</h1>
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
          Update Route
        </button>
      </form>
    </div>
  );
}

export default UpdateRoute;
