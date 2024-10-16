import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerSidebar from '../../../components/customer/CustomerSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditSpecialCollectionRequest() {
  const { id } = useParams(); // Retrieve request ID from the URL
  const [requestType, setRequestType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`/special-collections/${id}`);
        const { requestType, notes } = response.data;
        setRequestType(requestType);
        setNotes(notes);
        setLoading(false);
      } catch (err) {
        setError('Failed to load request details');
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/special-collections/${id}`, {
        requestType,
        notes,
      });
      toast.success('Request updated successfully');
      navigate('/customer/special_request_list'); // Redirect back to requests list after update
    } catch (err) {
      toast.error('Failed to update request');
      console.error(err);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="relative flex min-h-screen">
      <CustomerSidebar />
      
      <div className="flex-grow p-6 lg:ml-128 lg:p-10 mt-24 sm:mt-0">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-black rounded-sm"
        >
          Back
        </button>
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4">Edit Special Collection Request</h1>
        {loading ? (
          <p>Loading request details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-[sans-serif] text-[#333] max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">Request Type</label>
              <input
                type="text"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
                required
              />
            </div>
            <div>
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
              Update Request
            </button>
          </form>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default EditSpecialCollectionRequest;
