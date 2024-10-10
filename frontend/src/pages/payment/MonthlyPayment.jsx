import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'; // For formatting dates

const MonthlyPayment = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [paymentReport, setPaymentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:9500/user/allCustomers');
        setCustomers(response.data);
      } catch (err) {
        setError('Failed to fetch customers');
        console.error(err);
      }
    };
    fetchCustomers();
  }, []);

  // Handle the payment report request
  const handleMonthlyPayment = async (customerId) => {
    if (!selectedMonth || !selectedYear) {
      setError('Please select a month and year.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `http://localhost:9500/waste/payment/calculate-monthly-payment/${customerId}/${selectedMonth}/${selectedYear}`
      );
      setPaymentReport(response.data); // Save the report in state
    } catch (err) {
      setError('Failed to fetch payment report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download CSV function
  const downloadCSV = () => {
    if (!paymentReport) return;

    const csvRows = [];
    // Header row
    csvRows.push(`User ID: ${paymentReport.userId}`);
    csvRows.push(`Month/Year: ${paymentReport.month}/${paymentReport.year}`);
    csvRows.push(`Total Collections: ${paymentReport.totalCollections}`);
    csvRows.push(''); // Blank line for spacing
    // Table Header
    csvRows.push('Collection Date,Waste Quantity (kg),Recyclable Quantity (kg),Payment (USD)');

    // Data rows
    paymentReport.collectionDetails.forEach(collection => {
      const row = [
        moment(collection.collectionDate).format('MM/DD/YYYY'), // Formatted date
        collection.wasteQty,
        collection.recyclableQty,
        collection.payment
      ];
      csvRows.push(row.join(','));
    });

    csvRows.push(''); // Blank line for spacing
    // Summary rows
    csvRows.push(`Total Waste Collected: ${paymentReport.totalWaste} kg`);
    csvRows.push(`Total Recyclable Collected: ${paymentReport.totalRecyclable} kg`);
    csvRows.push(`Total Payment: $${paymentReport.totalPayment}`);

    // Convert rows to CSV string
    const csvContent = csvRows.join('\n');

    // Create a blob and trigger download
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
    <div>
      <h1>Monthly Payment Page</h1>
      
      {/* Month and Year input section */}
      <div>
        <label>
          Select Month:
          <input 
            type="number" 
            placeholder="Enter month (1-12)" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)} 
            min="1" 
            max="12"
          />
        </label>

        <label>
          Select Year:
          <input 
            type="number" 
            placeholder="Enter year" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)} 
          />
        </label>
      </div>

      {/* Error message display */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Customers table */}
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.Id}</td>
                <td>{customer.fullName}</td>
                <td>
                  <button
                    onClick={() => handleMonthlyPayment(customer.Id)}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Monthly Payment'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No customers found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Monthly Payment Report Display */}
      {paymentReport && (
        <div>
          <h2>Monthly Payment Report</h2>
          <p><strong>User ID:</strong> {paymentReport.userId}</p>
          <p><strong>Month/Year:</strong> {paymentReport.month}/{paymentReport.year}</p>
          <p><strong>Total Collections:</strong> {paymentReport.totalCollections}</p>

          {/* Table to display each collection */}
          <table>
            <thead>
              <tr>
                <th>Collection Date</th>
                <th>Waste Quantity (kg)</th>
                <th>Recyclable Quantity (kg)</th>
                <th>Payment (USD)</th>
              </tr>
            </thead>
            <tbody>
              {paymentReport.collectionDetails.map((collection, index) => (
                <tr key={index}>
                  <td>{moment(collection.collectionDate).format('YYYY-MM-DD')}</td>
                  <td>{collection.wasteQty}</td>
                  <td>{collection.recyclableQty}</td>
                  <td>${collection.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary of the report */}
          <div>
            <p><strong>Total Waste Collected:</strong> {paymentReport.totalWaste} kg</p>
            <p><strong>Total Recyclable Collected:</strong> {paymentReport.totalRecyclable} kg</p>
            <p><strong>Total Payment:</strong> ${paymentReport.totalPayment}</p>
          </div>

          {/* Button to download the report */}
          <button onClick={downloadCSV}>Download Report</button>
        </div>
      )}
    </div>
  );
};

export default MonthlyPayment;
