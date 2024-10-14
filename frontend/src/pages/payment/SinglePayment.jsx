import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

function SinglePayment() {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get("http://localhost:9500/waste/collection/all");
        setCollections(response.data);
      } catch (error) {
        console.error("Error:", error.response?.data?.error);
        toast.error("Error fetching collections");
      }
    };
    fetchCollections();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadCSV = () => {
    const csvRows = [];
    csvRows.push('Collector Name,Customer Name,Waste Quantity (kg),Recyclable Quantity (kg),Region,Collection Date');
    collections.forEach(collection => {
      const row = [
        collection.customerId?.name,
        collection.wasteQty,
        collection.recyclableQty,
        collection.region,
        new Date(collection.collectionDate).toLocaleDateString()
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Waste_Collection_Report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV is downloading!");
  };

  const handleViewPayment = (customerId, collectionId) => {
    // Ensure customerId is accessed properly
    const customerIdString = customerId._id || customerId; // Access the _id if it's an object, otherwise use it directly
  
    // Pass the correct customerId to the URL
    navigate(`/payment/viewSingleCollectionPayment/${customerIdString}/${collectionId}`);
  };
  

  const filteredCollections = collections.filter((collection) =>
    Object.values(collection).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedCollections = filteredCollections.sort((a, b) => 
    new Date(b.collectionDate) - new Date(a.collectionDate)
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", flexShrink: 0, backgroundColor: "#f8f9fa" }}>
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: "100px 20px 20px", backgroundColor: "#ffffff" }}>
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
          <h5 className="block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900">
            Single Payment
            </h5>
            <p className="block mt-1 font-sans text-base font-normal leading-relaxed text-gray-700">
            View and manage payment details for a specific waste collection.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              className="form-control px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300"
              onClick={handleDownloadCSV}
            >
              <FontAwesomeIcon icon={faFileCsv} /> Download CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table id="collection-table" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Customer Name</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Waste Quantity (kg)</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Recyclable Quantity (kg)</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Region</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Collection Date</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedCollections.map((collection) => (
                <tr key={collection._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collection.customerId?.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collection.wasteQty}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collection.recyclableQty}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collection.region}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(collection.collectionDate).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewPayment(collection.customerId, collection._id)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SinglePayment;
