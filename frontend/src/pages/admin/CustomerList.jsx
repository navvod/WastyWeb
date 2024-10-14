// src/components/customer/CustomerList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "../../components/AdminSidebar";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:9500/customer/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data.error : error.message);
      }
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9500/customer/delete/${id}`);
      setCustomers(customers.filter((customer) => customer._id !== id));
      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data.error : error.message);
    }
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("customer-table");
    const actionButtons = document.querySelectorAll(".action-button");
    actionButtons.forEach((button) => {
      button.style.display = "none";
    });

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const formattedTime = currentDate.toLocaleTimeString().replace(/:/g, "-");
      const filename = `Customer_List_Report_${formattedDate}_${formattedTime}.pdf`;

      pdf.save(filename);
      toast.success("Report is downloading!");

      actionButtons.forEach((button) => {
        button.style.display = "inline-block";
      });
    });
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
      <div style={{ width: "250px", flexShrink: 0, backgroundColor: "#f8f9fa" }}>
        <AdminSidebar />
      </div>

      <div style={{ flexGrow: 1, padding: "100px 20px 20px", backgroundColor: "#ffffff" }}>
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Customers List
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              See information about all customers
            </p>
          </div>

          <button
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
            type="button"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table id="customer-table" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Customer ID</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Full Name</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Email</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Phone</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Address</th>
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
                    {customer.address.line1}, {customer.address.line2}, {customer.address.city}, {customer.address.state}, {customer.address.postalCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                      {/* Delete Button */}
                      <button
                        className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                        title="Delete Customer"
                        onClick={() => handleDelete(customer._id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </span>
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

export default CustomerList;
