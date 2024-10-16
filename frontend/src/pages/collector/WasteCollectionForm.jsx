import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CollectorSidebar from '../../components/collector/CollectorSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WasteCollectionForm() {
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [wasteQty, setWasteQty] = useState('');
  const [recyclableQty, setRecyclableQty] = useState('');
  const [region, setRegion] = useState('');
  const collectorId = localStorage.getItem('collectorId');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/customer/customers'); // Adjust the endpoint as needed
        setCustomers(response.data);
      } catch (error) {
        toast.error('Failed to load customers');
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

        console.log(customerId);

      const response = await axios.post('/waste/submitWaste', {
        customerId,
        collectorId,
        wasteQty,
        recyclableQty,
        region,
      });

      console.log(customerId);
      

      toast.success(response.data.message);
      setCustomerId('');
      setWasteQty('');
      setRecyclableQty('');
      setRegion('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit waste collection');
    }
  };

  return (
    <div className="flex min-h-screen">
      <CollectorSidebar />

      <div className="flex-grow p-6 bg-gray-100 lg:ml-128 lg:p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Submit Waste Collection</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} 
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Waste Quantity (kg)</label>
            <input
              type="number"
              value={wasteQty}
              onChange={(e) => setWasteQty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Recyclable Quantity (kg)</label>
            <input
              type="number"
              value={recyclableQty}
              onChange={(e) => setRecyclableQty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md"
          >
            Submit Collection
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}

export default WasteCollectionForm;
