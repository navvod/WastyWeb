import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';

function ViewSinglePayment() {
  const { userId, collectionId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9500/waste/payment/viewSingleCollectionPayment/${userId}/${collectionId}`);
        setPaymentDetails(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        toast.error(error.response?.data?.error || "Failed to retrieve payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [userId, collectionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!paymentDetails) {
    return <div>No payment details found.</div>;
  }

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', flexShrink: 0, backgroundColor: '#f8f9fa' }}>
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '50px 20px', backgroundColor: '#ffffff' }}>
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-black rounded-sm"
        >
          Back
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Details</h2>
        
        <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
          <dl className="-my-3 divide-y divide-gray-100 text-sm">
            <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Collection ID</dt>
              <dd className="text-gray-700 sm:col-span-2">{paymentDetails.collectionId}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Customer ID</dt>
              <dd className="text-gray-700 sm:col-span-2">{paymentDetails.customerId || 'Not Available'}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Collection Date</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {new Date(paymentDetails.collectionDateTime).toLocaleString()}
              </dd>
            </div>
            <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Waste Quantity (kg)</dt>
              <dd className="text-gray-700 sm:col-span-2">{paymentDetails.wasteQty}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Recyclable Quantity (kg)</dt>
              <dd className="text-gray-700 sm:col-span-2">{paymentDetails.recyclableQty}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Payment</dt>
              <dd className="text-gray-700 sm:col-span-2">${paymentDetails.payment !== undefined ? paymentDetails.payment : 'Not Available'}</dd>
            </div>

          </dl>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ViewSinglePayment;
