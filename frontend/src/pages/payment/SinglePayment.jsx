import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

function SinglePayment() {
  const { userId, collectionId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container">
      <h2>Payment Details</h2>
      <p><strong>Collection ID:</strong> {paymentDetails.collectionId}</p>
      <p><strong>Collection Date:</strong> {new Date(paymentDetails.collectionDateTime).toLocaleString()}</p>
      <p><strong>Waste Quantity (kg):</strong> {paymentDetails.wasteQty}</p>
      <p><strong>Recyclable Quantity (kg):</strong> {paymentDetails.recyclableQty}</p>
      <p><strong>Payment:</strong> ${paymentDetails.payment !== undefined ? paymentDetails.payment : 'Not Available'}</p>
      <p><strong>Customer ID:</strong> {paymentDetails.customerId || 'Not Available'}</p>
      <ToastContainer />
    </div>
  );
}

export default SinglePayment;
