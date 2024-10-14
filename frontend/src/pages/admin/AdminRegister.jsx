import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/AdminSidebar'; // Adjust the path as necessary

const initialState = {
  fullName: "",
  contactNumber: "",
  username: "",
  email: "",
  password: "",
};

function AdminRegister() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

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
      await axios.post("http://localhost:9500/user/register-admin", formData);
      toast.success("Admin registered successfully!");
      setFormData(initialState);
      navigate("/user/allAdmins");
    } catch (error) {
      console.error("Error:", error.response?.data?.error);
      toast.error("Failed to register admin");
    }
  };

  const validateForm = () => {
    const { fullName, contactNumber, username, email, password } = formData;
    if (!fullName || !contactNumber || !username || !email || !password) {
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
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
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
        <h1 className="text-2xl font-semibold text-[#333] mb-4">Admin Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4 font-[sans-serif] text-[#333]">
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            required
          />
          <input
            type="text"
            placeholder="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            required
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            required
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2.5 text-sm bg-[#333] hover:bg-[#222] text-white rounded-sm"
          >
            Register
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminRegister;
