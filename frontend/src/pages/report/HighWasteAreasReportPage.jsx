import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../../components/AdminSidebar';

function HighWasteAreasReportPage() {
  const [reportData, setReportData] = useState([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/reports/ReportHome');
  };

  const fetchHighWasteAreasReport = async () => {
    try {
      const response = await axios.get('http://localhost:9500/waste/wasteCollection/highWasteAreasReport');
      setReportData(response.data);
      if (response.data.length > 0) {
      } else {
        toast.warn('No data available for high waste areas.');
      }
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

    const tableData = reportData.map(item => ({
      region: item._id,
      totalWaste: item.totalWaste,
    }));

    doc.autoTable({
      head: [['Region', 'Total Waste (kg)']],
      body: tableData.map(item => [item.region, item.totalWaste]),
      startY: 30,
    });

    doc.save('High_Waste_Areas_Report.pdf');
    toast.success('PDF report is downloading!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', flexShrink: 0, backgroundColor: '#f8f9fa' }}>
        <AdminSidebar />
      </div>

      <div style={{ flexGrow: 1, padding: '100px 20px 20px', backgroundColor: '#ffffff' }}>
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              High Waste Areas Report
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Overview of regions with the highest waste accumulation
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
          >
            <FontAwesomeIcon icon={faFilePdf} /> Download PDF
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {reportData.length > 0 ? (
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Region</th>
                  <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Total Waste (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((item) => (
                  <tr key={item._id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{item._id}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{item.totalWaste} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-700 mt-4">No data available for high waste areas.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default HighWasteAreasReportPage;
