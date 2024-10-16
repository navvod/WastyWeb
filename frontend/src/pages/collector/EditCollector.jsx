import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function EditCollector() {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    username: "",
    collectorType: "",
    email: "",
  });

  useEffect(() => {
    const fetchCollector = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9500/user/get/${Id}`
        );
        const collectorData = response.data;

        setFormData(collectorData);
      } catch (error) {
        console.error("Error:", error.response.data.error);
      }
    };
    fetchCollector();
  }, [Id]);

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
        `http://localhost:9500/user/update-manager/${Id}`,
        formData
      );
      console.log("Collector details updated successfully!");
      toast.success("Collector details updated successfully!");
      navigate("/user/allcollectors");
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error("Failed to update collector details.");
    }
  };

  const validateForm = () => {
    const { fullName, contactNumber, username, collectorType, email } = formData;
    if (!fullName || !contactNumber || !username || !collectorType || !email) {
      toast.error("All fields are required.");
      return false;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      toast.error("Contact number must be 10 digits.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email address.");
      return false;
    }

    return true;
  };

  const handleChangePassword = () => {
    navigate(`/user/change-password/${Id}`);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="col-md-4">
        <div className="card shadow-lg p-3 mb-5 bg-body rounded">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Edit Collector</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="contactNumber" className="form-label">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="collectorType" className="form-label">
                  Collector Type
                </label>
                <select
                  className="form-select"
                  id="collectorType"
                  name="collectorType"
                  value={formData.collectorType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Collector Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleChangePassword}
                >
                  Change Password
                </button>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditCollector;
