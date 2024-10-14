import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../../components/AdminSidebar";

function CustomerApproval() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPendingCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:9500/customer/pending");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching pending customers:", error.message);
      }
    };
    fetchPendingCustomers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:9500/customer/approve/${id}`);
      setCustomers(customers.filter((customer) => customer._id !== id));
      toast.success("Customer approved successfully!");
    } catch (error) {
      console.error("Error approving customer:", error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:9500/customer/reject/${id}`);
      setCustomers(customers.filter((customer) => customer._id !== id));
      toast.success("Customer rejected successfully!");
    } catch (error) {
      console.error("Error rejecting customer:", error.message);
    }
  };

  const handleDownload = (nicIdImagePath, addressVerificationDocPath) => {
    const downloadFile = (filePath) => {
      const filename = filePath.split('/').pop(); 
      const link = document.createElement("a");
      link.href = `http://localhost:9500/customer/download/${filename}`;
      link.setAttribute("download", filename);
      link.style.display = "none"; // Hide the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    // Trigger both downloads with a slight delay
    downloadFile(nicIdImagePath);
    setTimeout(() => downloadFile(addressVerificationDocPath), 500); // Adjust delay if necessary
  };
  

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", flexShrink: 0, backgroundColor: "#f8f9fa" }}>
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, padding: "100px 20px 20px", backgroundColor: "#ffffff" }}>
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Pending Customer Approvals
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Review documents and approve or reject customers
            </p>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table id="customer-table" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Customer ID</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Full Name</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Email</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Phone</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Documents</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{customer._id}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{customer.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{customer.email}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{customer.phone}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <td className="whitespace-nowrap px-4 py-2 text-center align-start">
  <button
    onClick={() => handleDownload(customer.nicIdImage, customer.addressVerificationDoc)}
    className="flex justify-center items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85]"
    style={{ width: "100%", justifyContent: "center" }}
  >
    Download Documents
  </button>
</td>



                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <button
                      onClick={() => handleApprove(customer._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(customer._id)}
                      className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Reject
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

export default CustomerApproval;
