import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "../../components/AdminSidebar";

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:9500/user/allAdmins");
        setAdmins(response.data);
      } catch (error) {
        console.error("Error:", error.response.data.error);
      }
    };
    fetchAdmins();
  }, []);

  const handleEdit = (id) => {
    navigate(`/user/update-admin/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9500/user/delete/${id}`);
      setAdmins(admins.filter((admin) => admin.Id !== id));
      toast.success("Admin deleted successfully!");
    } catch (error) {
      console.error("Error:", error.response.data.error);
    }
  };

  const handleClickNewAdmin = () => {
    navigate("/user/register-admin");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("admin-table");
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
      const filename = `Admin List Report_${formattedDate}_${formattedTime}.pdf`;

      pdf.save(filename);
      toast.success("Report is downloading!");

      actionButtons.forEach((button) => {
        button.style.display = "inline-block";
      });
    });
  };

  const filteredAdmins = admins.filter((admin) =>
    Object.values(admin).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar with fixed width */}
      <div style={{ width: "250px", flexShrink: 0, backgroundColor: "#f8f9fa" }}>
        <AdminSidebar />
      </div>

      {/* Main Content Area with Flex Grow */}

<div style={{ flexGrow: 1, padding: "100px 20px 20px", backgroundColor: "#ffffff" }}>
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Admins List
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              See information about all admins
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
            {/* Download PDF Button */}
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
              type="button"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>

            {/* Add Admin Button */}
            <button
              className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85]"
              type="button"
              onClick={handleClickNewAdmin}
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              Add Admin
            </button>
          </div>
        </div>

        {/* Admin Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table id="admin-table" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Admin ID</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Full Name</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Contact Number</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Username</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Email</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.Id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{admin.Id}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{admin.fullName}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{admin.contactNumber}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{admin.username}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{admin.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                       {/* Edit Button */}
    <button
      className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative"
      title="Edit Admin"
      onClick={() => handleEdit(admin.Id)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    </button>

    {/* Delete Button */}
    <button
      className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
      title="Delete Admin"
      onClick={() => handleDelete(admin.Id)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
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

export default AdminList;
