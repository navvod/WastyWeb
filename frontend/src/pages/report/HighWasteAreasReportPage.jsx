import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function HighWasteAreasReportPage() {
  const [reportData, setReportData] = useState([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/reports/ReportHome'); // Navigate back to the report home page
  };

  const fetchHighWasteAreasReport = async () => {
    try {
      const response = await axios.get('http://localhost:9500/waste/wasteCollection/highWasteAreasReport');
      setReportData(response.data);
      toast.success('High waste areas report generated successfully!');
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      toast.error('Failed to generate high waste areas report!');
    }
  };

  useEffect(() => {
    fetchHighWasteAreasReport();
  }, []);

  const handleDownloadPDF = () => {
    if (reportData.length === 0) {
      toast.error('No report data available for download!');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('High Waste Areas Report', 14, 20);

    // Create an auto table for the report data
    const tableData = reportData.map(item => ({
      region: item._id,
      totalWaste: item.totalWaste,
    }));

    doc.autoTable({
      head: [['Region', 'Total Waste (kg)']],
      body: tableData.map(item => [item.region, item.totalWaste]),
      startY: 30,
    });

    // Save the PDF
    doc.save('High_Waste_Areas_Report.pdf');
    toast.success('PDF report is downloading!');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2 className="text-center">High Waste Areas Report</h2>
          <button className="btn btn-secondary mb-3" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Reports Home
          </button>

          <button className="btn btn-danger mb-3" onClick={handleDownloadPDF}>
            <FontAwesomeIcon icon={faFilePdf} /> Download PDF
          </button>

          <h4>Report Summary</h4>
          {reportData.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Total Waste (kg)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.totalWaste} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available for high waste areas.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default HighWasteAreasReportPage;
