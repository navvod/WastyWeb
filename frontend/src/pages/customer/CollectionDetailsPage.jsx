import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CollectionDetailsPage() {
  const [collections, setCollections] = useState([]);
  const customerId = localStorage.getItem('customerId'); // Retrieve customerId from local storage

  // Fetch collection details for the customer
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        const response = await axios.get(`/waste/${customerId}/collections`);
        setCollections(response.data.collections || []); // Set collections data from the response
      } catch (error) {
        toast.error("Failed to fetch collection details");
      }
    };

    fetchCollectionDetails();
  }, [customerId]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <CustomerSidebar />
      <div className="flex-grow p-6 bg-gray-100 lg:ml-128 lg:p-10">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6">Collection Details</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Waste Collection Records</h3>
            <p className="text-sm text-gray-600">Details of all waste collections associated with your account</p>
          </div>
          <div className="px-4 sm:px-6 pb-6 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left text-sm sm:text-base">Date</th>
                  <th className="py-2 px-4 text-left text-sm sm:text-base">Recyclable Qty (kg)</th>
                  <th className="py-2 px-4 text-left text-sm sm:text-base">Waste Qty (kg)</th>
                  <th className="py-2 px-4 text-left text-sm sm:text-base">Region</th>
                  <th className="py-2 px-4 text-left text-sm sm:text-base">Payment</th>
                  <th className="py-2 px-4 text-left text-sm sm:text-base">Collector</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection) => (
                  <tr key={collection._id} className="border-b last:border-b-0 text-sm sm:text-base">
                    <td className="py-2 px-4">{new Date(collection.collectionDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{collection.recyclableQty}</td>
                    <td className="py-2 px-4">{collection.wasteQty}</td>
                    <td className="py-2 px-4">{collection.region}</td>
                    <td className="py-2 px-4">${collection.payment.toFixed(2)}</td>
                    <td className="py-2 px-4">{collection.collectorId.fullName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
