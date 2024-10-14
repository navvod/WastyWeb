import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/AdminSidebar';

function RecyclingRateReportPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a valid date range.");
      return;
    }

    try {
      const payload = { startDate, endDate };
      const response = await axios.post('http://localhost:9500/waste/wasteCollection/recyclingRateReport', payload);
      setReportData(response.data);
      toast.success("Recycling rate report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate recycling rate report.");
    }
  };

  const handleDownloadPDF = () => {
    if (!reportData) {
      toast.error('No report data available for download!');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Recycling Rate Report', 14, 20);
    doc.setFontSize(12);

    const reportContent = [
      { label: 'Total Waste', value: `${reportData.totalWaste} kg` },
      { label: 'Total Recyclable Waste', value: `${reportData.totalRecyclable} kg` },
      { label: 'Recycling Rate', value: `${reportData.recyclingRate}%` },
    ];

    reportContent.forEach((item, index) => {
      doc.text(`${item.label}: ${item.value}`, 14, 30 + (10 * index));
    });

    doc.save('Recycling_Rate_Report.pdf');
    toast.success('PDF report is downloading!');
  };

  const handleBack = () => {
    navigate('/reports/ReportHome');
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
              Recycling Rate Report
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Generate recycling rate for the selected date range
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
            <label className="block mb-1">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            />
          </div>

          <div className="form-group mt-4">
            <label className="block mb-1">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
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
                  <dt className="font-medium text-gray-900">Total Waste</dt>
                  <dd className="text-gray-700 sm:col-span-2">{reportData.totalWaste} kg</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Total Recyclable Waste</dt>
                  <dd className="text-gray-700 sm:col-span-2">{reportData.totalRecyclable} kg</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Recycling Rate</dt>
                  <dd className="text-gray-700 sm:col-span-2">{reportData.recyclingRate}%</dd>
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

export default RecyclingRateReportPage;
