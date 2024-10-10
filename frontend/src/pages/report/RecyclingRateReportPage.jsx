import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function RecyclingRateReportPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const navigate = useNavigate();

  // Handler to generate the recycling rate report
  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a valid date range.");
      return;
    }

    try {
      const payload = {
        startDate,
        endDate,
      };

      // Call the backend API to get the recycling rate report
      const response = await axios.post('http://localhost:9500/waste/wasteCollection/recyclingRateReport', payload);
      setReportData(response.data); // Set the report data in state
      toast.success("Recycling rate report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate recycling rate report.");
    }
  };

  // Navigate back to reports home
  const handleBack = () => {
    navigate('/reports/ReportHome');
  };

  // Handler to download the report as a PDF
  const handleDownloadPDF = () => {
    if (!reportData) {
      toast.error('No report data available for download!');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Recycling Rate Report', 14, 20);
    doc.setFontSize(12);
    
    // Adding report data to the PDF
    const reportContent = [
      { label: 'Total Waste', value: `${reportData.totalWaste} kg` },
      { label: 'Total Recyclable Waste', value: `${reportData.totalRecyclable} kg` },
      { label: 'Recycling Rate', value: `${reportData.recyclingRate}%` },
    ];

    reportContent.forEach((item, index) => {
      doc.text(`${item.label}: ${item.value}`, 14, 30 + (10 * index));
    });

    // Save the PDF
    doc.save('Recycling_Rate_Report.pdf');
    toast.success('PDF report is downloading!');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2 className="text-center">Generate Recycling Rate Report</h2>
          <button className="btn btn-secondary mb-3" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Reports Home
          </button>

          {/* Date range input */}
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Button to generate report */}
          <button className="btn btn-primary mt-3" onClick={handleGenerateReport}>
            Generate Report
          </button>

          {/* Button to download the report as a PDF */}
          <button className="btn btn-danger mt-3" onClick={handleDownloadPDF} disabled={!reportData}>
            <FontAwesomeIcon icon={faFilePdf} /> Download PDF
          </button>

          {/* Display the report data */}
          {reportData && (
            <div className="mt-4">
              <h4>Recycling Rate Report</h4>
              <p><strong>Total Waste:</strong> {reportData.totalWaste} kg</p>
              <p><strong>Total Recyclable Waste:</strong> {reportData.totalRecyclable} kg</p>
              <p><strong>Recycling Rate:</strong> {reportData.recyclingRate}%</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RecyclingRateReportPage;
