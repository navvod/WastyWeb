import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function CollectionReportPage() {
  const [type, setType] = useState('daily');
  const [region, setRegion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const navigate = useNavigate();

  const handleTypeChange = (e) => {
    setType(e.target.value);
    if (e.target.value !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleGenerateReport = async () => {
    try {
      const query = new URLSearchParams({
        type,
        region,
      });

      if (type === 'custom') {
        query.append('startDate', startDate);
        query.append('endDate', endDate);
      }

      const response = await axios.get(`http://localhost:9500/waste/wasteCollection/report?${query.toString()}`);

      setReportData(response.data);
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      toast.error('Failed to generate report!');
    }
  };

  const handleBack = () => {
    navigate('/reports/ReportHome'); // Navigate back to the report home page
  };

  const handleDownloadPDF = () => {
    if (!reportData) {
      toast.error('No report data available for download!');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Waste Collection Report', 14, 20);

    // Add report summary
    doc.setFontSize(12);
    doc.text(`Type: ${reportData.reportType}`, 14, 30);
    doc.text(`Total Waste: ${reportData.totalWaste} kg`, 14, 35);
    doc.text(`Total Recyclable Waste: ${reportData.totalRecyclable} kg`, 14, 40);

    // Create an auto table for detailed data
    const tableData = Object.entries(reportData.reportData).map(([key, data]) => ({
      region: key,
      totalWaste: data.totalWaste,
      totalRecyclable: data.totalRecyclable,
    }));

    doc.autoTable({
      head: [['Date', 'Total Waste (kg)', 'Total Recyclable Waste (kg)']],
      body: tableData.map(item => [item.region, item.totalWaste, item.totalRecyclable]),
      startY: 50,
    });

    // Save the PDF
    doc.save('Waste_Collection_Report.pdf');
    toast.success('PDF report is downloading!');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2 className="text-center">Generate Collection Report</h2>
          <button className="btn btn-secondary mb-3" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Reports Home
          </button>

          <div className="form-group">
            <label htmlFor="type">Report Type:</label>
            <select id="type" className="form-control" value={type} onChange={handleTypeChange}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {type === 'custom' && (
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input 
                type="date" 
                id="startDate" 
                className="form-control" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
              <label htmlFor="endDate">End Date:</label>
              <input 
                type="date" 
                id="endDate" 
                className="form-control" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="region">Region (optional):</label>
            <input 
              type="text" 
              id="region" 
              className="form-control" 
              placeholder="Enter region if applicable" 
              value={region} 
              onChange={(e) => setRegion(e.target.value)} 
            />
          </div>

          <button className="btn btn-primary mt-3" onClick={handleGenerateReport}>
            Generate Report
          </button>

          {reportData && (
            <div className="mt-4">
              <h4>Report Summary</h4>
              <p><strong>Type:</strong> {reportData.reportType}</p>
              <p><strong>Total Waste:</strong> {reportData.totalWaste} kg</p>
              <p><strong>Total Recyclable Waste:</strong> {reportData.totalRecyclable} kg</p>

              <h5>Breakdown by {type === 'region' ? 'Region' : 'Date'}:</h5>
              <ul>
                {Object.entries(reportData.reportData).map(([key, data]) => (
                  <li key={key}>
                    {key}: {data.totalWaste} kg waste, {data.totalRecyclable} kg recyclable
                  </li>
                ))}
              </ul>

              <button className="btn btn-danger mt-3" onClick={handleDownloadPDF}>
                <FontAwesomeIcon icon={faFilePdf} /> Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CollectionReportPage;
