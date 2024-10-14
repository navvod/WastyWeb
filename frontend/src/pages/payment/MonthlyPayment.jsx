import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/AdminSidebar';

const MonthlyPayment = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentReport, setPaymentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:9500/customer/customers');
        setCustomers(response.data);
      } catch (err) {
        setError('Failed to fetch customers');
        console.error(err);
      }
    };
    fetchCustomers();
  }, []);

  const handleMonthlyPayment = async (customerId) => {
    if (!selectedDate) {
      setError('Please select a month and year.');
      return;
    }

    const month = moment(selectedDate).format('MM');
    const year = moment(selectedDate).format('YYYY');

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `http://localhost:9500/waste/payment/calculate-monthly-payment/${customerId}/${month}/${year}`
      );
      setPaymentReport(response.data);
    } catch (err) {
      setError('Failed to fetch payment report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!paymentReport) return;
    const csvRows = [];
    csvRows.push(`User ID: ${paymentReport.userId}`);
    csvRows.push(`Month/Year: ${paymentReport.month}/${paymentReport.year}`);
    csvRows.push(`Total Collections: ${paymentReport.totalCollections}`);
    csvRows.push('');
    csvRows.push('Collection Date,Waste Quantity (kg),Recyclable Quantity (kg),Payment (USD)');
    paymentReport.collectionDetails.forEach(collection => {
      const row = [
        moment(collection.collectionDate).format('MM/DD/YYYY'),
        collection.wasteQty,
        collection.recyclableQty,
        collection.payment
      ];
      csvRows.push(row.join(','));
    });
    csvRows.push('');
    csvRows.push(`Total Waste Collected: ${paymentReport.totalWaste} kg`);
    csvRows.push(`Total Recyclable Collected: ${paymentReport.totalRecyclable} kg`);
    csvRows.push(`Total Payment: $${paymentReport.totalPayment}`);
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Monthly_Payment_Report_${paymentReport.month}_${paymentReport.year}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", flexShrink: 0, backgroundColor: "#f8f9fa" }}>
        <AdminSidebar />
      </div>
      <div style={{ flexGrow: 1, padding: "100px 20px 20px", backgroundColor: "#ffffff" }}>
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5 className="text-xl font-semibold leading-snug text-blue-gray-900">Monthly Payment Report</h5>
            <p className="text-base font-normal leading-relaxed text-gray-700">
              Generate and download monthly payment reports for customers
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="border border-gray-300 rounded-md py-2 px-4"
              placeholderText="Select Month/Year"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
          <table className="min-w-full bg-white text-sm rounded-lg shadow">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-900">Customer ID</th>
                <th className="text-left px-4 py-2 font-medium text-gray-900">Customer Name</th>
                <th className="text-left px-4 py-2 font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{customer._id}</td>
                    <td className="px-4 py-2">{customer.name}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleMonthlyPayment(customer._id)}
                        disabled={loading}
                        className="px-4 py-2 bg-black hover:bg-black-600 text-white rounded-lg disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Generate Report'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center text-gray-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paymentReport && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Monthly Payment Report</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>User ID:</strong> {paymentReport.userId}</p>
              <p><strong>Month/Year:</strong> {paymentReport.month}/{paymentReport.year}</p>
              <p><strong>Total Collections:</strong> {paymentReport.totalCollections}</p>
            </div>
            <table className="min-w-full bg-white rounded-lg shadow mt-4">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">Collection Date</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">Waste Quantity (kg)</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">Recyclable Quantity (kg)</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">Payment (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentReport.collectionDetails.map((collection, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{moment(collection.collectionDate).format('YYYY-MM-DD')}</td>
                    <td className="px-4 py-2">{collection.wasteQty}</td>
                    <td className="px-4 py-2">{collection.recyclableQty}</td>
                    <td className="px-4 py-2">${collection.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-2 text-gray-700">
              <p><strong>Total Waste Collected:</strong> {paymentReport.totalWaste} kg</p>
              <p><strong>Total Recyclable Collected:</strong> {paymentReport.totalRecyclable} kg</p>
              <p><strong>Total Payment:</strong> ${paymentReport.totalPayment}</p>
            </div>
            <button onClick={downloadCSV} className="mt-4 px-4 py-2 bg-black  text-white rounded-lg">
              Download CSV
            </button>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default MonthlyPayment;
