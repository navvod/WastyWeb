import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerPaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPayback, setTotalPayback] = useState(0);
  const [collections, setCollections] = useState([]); // Initialize as empty array

  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`/waste/${customerId}/payments`);
        setTotalAmount(response.data.totalAmount);
        setTotalPayback(response.data.totalPayback);
      } catch (error) {
        toast.error("Failed to fetch payment details");
      }
    };

    const fetchCollectionDetails = async () => {
        try {
          const response = await axios.get(`/waste/${customerId}/collections`);
          console.log(response.data); // Verify the response format here
          setCollections(response.data.collections || []); // Access 'collections' property directly
        } catch (error) {
          toast.error("Failed to fetch collection details");
        }
      };

    fetchPaymentDetails();
    fetchCollectionDetails();
  }, [customerId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTotalAmount((prevTotalAmount) => prevTotalAmount - (prevTotalAmount / 2));
    toast.success("Payment processed successfully!");
  };

  const balance = totalAmount - totalPayback;

  return (
    <div className="flex min-h-screen">
      <CustomerSidebar />
      
      <div className="flex-grow space-y-8 p-6 bg-gray-100 lg:ml-128 lg:p-10">
        <ToastContainer />
        <h2 className="text-2xl font-bold">Payments and Recycling Paybacks</h2>

        {/* Balance Summary */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Balance Summary</h3>
            <p className="text-sm text-gray-600">Your current balance and recycling credits</p>
          </div>
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Charges</p>
                <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recycling Paybacks</p>
                <p className="text-2xl font-bold text-green-600">-${totalPayback.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Balance Due</p>
                <p className="text-2xl font-bold text-red-600">${balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Details Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Collection Details</h3>
            <p className="text-sm text-gray-600">Your recent waste collections</p>
          </div>
          <div className="px-6 pb-6 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Collection Date</th>
                  <th className="py-2 px-4 text-left">Recyclable Quantity (kg)</th>
                  <th className="py-2 px-4 text-left">Waste Quantity (kg)</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2 px-4">{new Date(collection.collectionDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{collection.recyclableQty}</td>
                    <td className="py-2 px-4">{collection.wasteQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Make a Payment</h3>
            <p className="text-sm text-gray-600">Enter your payment details below</p>
          </div>
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select payment method</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              {(paymentMethod === "credit" || paymentMethod === "debit") && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Make Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
