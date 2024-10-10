import React, { useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js
import { ToastContainer, toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';

function ChartsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [wasteOverTimeData, setWasteOverTimeData] = useState([]);
  const [wasteByRegionData, setWasteByRegionData] = useState([]);
  const [recyclableVsNonRecyclableData, setRecyclableVsNonRecyclableData] = useState({});

  // Fetch Waste Collected Over Time Data
  const fetchWasteOverTimeData = async () => {
    try {
      const response = await axios.get(`http://localhost:9500/waste/wasteCollection/wasteOvertime`, {
        params: { startDate, endDate },
      });
      setWasteOverTimeData(response.data);
    } catch (error) {
      console.error('Error fetching waste over time:', error);
      toast.error('Failed to fetch waste data over time');
    }
  };

  // Fetch Waste Collected By Region Data
  const fetchWasteByRegionData = async () => {
    try {
      const response = await axios.get(`http://localhost:9500/waste/wasteCollection/byRegion`, {
        params: { startDate, endDate },
      });
      setWasteByRegionData(response.data);
    } catch (error) {
      console.error('Error fetching waste by region:', error);
      toast.error('Failed to fetch waste data by region');
    }
  };

  // Fetch Recyclable vs Non-Recyclable Data
  const fetchRecyclableVsNonRecyclableData = async () => {
    try {
      const response = await axios.get(`http://localhost:9500/waste/wasteCollection/recyclableVsNonRecyclable`, {
        params: { startDate, endDate },
      });
      setRecyclableVsNonRecyclableData(response.data);
    } catch (error) {
      console.error('Error fetching recyclable vs non-recyclable data:', error);
      toast.error('Failed to fetch recyclable vs non-recyclable data');
    }
  };

  // Handle report generation
  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error('Please select a valid date range');
      return;
    }

    fetchWasteOverTimeData();
    fetchWasteByRegionData();
    fetchRecyclableVsNonRecyclableData();
  };

  // Prepare chart data
  const prepareWasteOverTimeChart = () => ({
    labels: wasteOverTimeData.map((data) => data._id),
    datasets: [
      {
        label: 'Total Waste Collected (kg)',
        data: wasteOverTimeData.map((data) => data.totalWaste),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Total Recyclable Waste (kg)',
        data: wasteOverTimeData.map((data) => data.totalRecyclable),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
    ],
  });

  const prepareWasteByRegionChart = () => ({
    labels: wasteByRegionData.map((data) => data._id),
    datasets: [
      {
        label: 'Total Waste (kg)',
        data: wasteByRegionData.map((data) => data.totalWaste),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Total Recyclable (kg)',
        data: wasteByRegionData.map((data) => data.totalRecyclable),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  });

  const prepareRecyclableVsNonRecyclableChart = () => ({
    labels: ['Recyclable Waste', 'Non-Recyclable Waste'],
    datasets: [
      {
        label: 'Waste Composition (kg)',
        data: [
          recyclableVsNonRecyclableData.totalRecyclable,
          recyclableVsNonRecyclableData.totalNonRecyclable,
        ],
        backgroundColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)'],
      },
    ],
  });

  // Download charts as PDF
  const downloadPDF = async () => {
    const input = document.getElementById('charts');

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape');

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 10, 10, 280, 160); // Adjust the width and height as needed
    pdf.save('charts-report.pdf');
  };

  return (
    <div className="container">
      <h2 className="text-center">Waste Management Charts</h2>

      {/* Date Range Inputs */} 
      <div className="d-flex align-items-center mb-4">
        <div className="mr-2">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="ml-2">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="ml-3">
          <button className="btn btn-primary mt-3" onClick={handleGenerateReport}>
            Generate Report
          </button>
        </div>
      </div>

      {/* Charts Container */}
      <div id="charts">
        {/* Waste Collected Over Time Chart */}
        <div className="mb-5">
          <h4>Waste Collected Over Time</h4>
          <Line data={prepareWasteOverTimeChart()} />
        </div>

        {/* Waste Collected by Region Chart */}
        <div className="mb-5">
          <h4>Waste Collected by Region</h4>
          <Bar data={prepareWasteByRegionChart()} />
        </div>

        {/* Recyclable vs Non-Recyclable Waste Chart */}
        <div className="mb-5">
          <h4>Recyclable vs Non-Recyclable Waste</h4>
          <Pie data={prepareRecyclableVsNonRecyclableChart()} />
        </div>
      </div>

      {/* PDF Download Button */}
      <button className="btn btn-success mt-3" onClick={downloadPDF}>
        Download PDF
      </button>

      <ToastContainer />
    </div>
  );
}

export default ChartsPage;
