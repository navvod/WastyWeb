import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import CustomerSidebar from "../../../components/customer/CustomerSidebar";

function SpecialCollectionForm() {
  const [requestType, setRequestType] = useState('');
  const [notes, setNotes] = useState('');
  const customerId = localStorage.getItem('customerId'); // Retrieve customer ID
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Customer ID:", customerId);

      await axios.post('/special-collections', {
        customerId,
        requestType,
        notes,
      });

      toast.success('Special collection request submitted successfully');
    } catch (err) {
      toast.error('Failed to submit request');
      console.error(err);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="relative flex min-h-screen">
      <CustomerSidebar />
      
      {/* Main Content Area */}
      <div className="flex-grow p-6 lg:ml-128 lg:p-10 mt-24 sm:mt-0">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-black rounded-sm"
        >
          Back
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">New Special Collection Request</h1>
        <form onSubmit={handleSubmit} className="space-y-4 font-[sans-serif] text-[#333] max-w-md">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Request Type</label>
            <input
              type="text"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2.5 text-sm bg-[#333] hover:bg-[#222] text-white rounded-sm"
          >
            Submit Request
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SpecialCollectionForm;
