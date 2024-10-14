import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/AdminSidebar';
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
      const query = new URLSearchParams({ type, region });
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
    navigate('/reports/ReportHome');
  };

  const handleDownloadPDF = () => {
    if (!reportData) {
      toast.error('No report data available for download!');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Waste Collection Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Type: ${reportData.reportType}`, 14, 30);
    doc.text(`Total Waste: ${reportData.totalWaste} kg`, 14, 35);
    doc.text(`Total Recyclable Waste: ${reportData.totalRecyclable} kg`, 14, 40);

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

    doc.save('Waste_Collection_Report.pdf');
    toast.success('PDF report is downloading!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', flexShrink: 0, backgroundColor: '#f8f9fa' }}>
        <AdminSidebar />
      </div>

      <div style={{ flexGrow: 1, padding: '100px 20px', backgroundColor: '#ffffff' }}>
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Generate Collection Report
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Generate waste collection data for the selected period.
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
          >
            <FontAwesomeIcon icon={faFilePdf} /> Download PDF
          </button>
        </div>

        <div className="space-y-4 font-[sans-serif] text-[#333]">
          <div className="form-group">
            <label className="block mb-1">Report Type:</label>
            <select
              value={type}
              onChange={handleTypeChange}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {type === 'custom' && (
            <div className="form-group">
              <label className="block mb-1">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
              />
              <label className="block mb-1 mt-3">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
              />
            </div>
          )}

          <div className="form-group">
            <label className="block mb-1">Region (optional):</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
              placeholder="Enter region if applicable"
            />
          </div>

          <button
            onClick={handleGenerateReport}
            className="mt-4 px-6 py-2.5 text-sm bg-[#333] hover:bg-[#222] text-white rounded-sm"
          >
            Generate Report
          </button>

          {reportData && (
            <div className="mt-8 flow-root rounded-lg border border-gray-100 p-4 shadow-sm">
              <dl className="-my-3 divide-y divide-gray-100 text-sm">
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Type</dt>
                  <dd className="text-gray-700 sm:col-span-2">{reportData.reportType}</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Total Waste</dt>
                  <dd className="text-gray-700 sm:col-span-2">{reportData.totalWaste} kg</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Total Recyclable Waste</dt>
                  <dd className="text-gray-700 sm:col-span-2">{reportData.totalRecyclable} kg</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Breakdown by {type === 'region' ? 'Region' : 'Date'}</dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    <ul className="space-y-2 bg-gray-50 p-4 rounded-md">
                      {Object.entries(reportData.reportData).map(([key, data]) => (
                        <li key={key} className="flex justify-between p-2 border-b border-gray-200">
                          <span className="font-medium text-gray-900">{key}</span>
                          <span className="text-gray-700">
                            {data.totalWaste} kg waste, {data.totalRecyclable} kg recyclable
                          </span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default CollectionReportPage;
