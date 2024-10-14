import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "../../components/AdminSidebar";

// Custom styles for the modal
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

Modal.setAppElement("#root");

function CollectorList() {
  const [collectors, setCollectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCollector, setCurrentCollector] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    username: "",
    collectorType: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const response = await axios.get("http://localhost:9500/user/allCollectors");
        setCollectors(response.data);
      } catch (error) {
        console.error("Error:", error.response.data.error);
      }
    };
    fetchCollectors();
  }, []);

  const openAddModal = () => {
    setFormData({
      fullName: "",
      contactNumber: "",
      username: "",
      email: "",
      password: "",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (collector) => {
    setCurrentCollector(collector);
    setFormData({
      fullName: collector.fullName,
      contactNumber: collector.contactNumber,
      username: collector.username,
      email: collector.email,
      password: "",  // Allow user to optionally set a new password on edit
    });
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCollector = async () => {
    try {
      await axios.post("http://localhost:9500/user/register-collecter", formData);
      setCollectors([...collectors, formData]);
      toast.success("Collector added successfully!");
      closeModals();
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error("Failed to add collector.");
    }
  };

  const handleEditCollector = async () => {
    try {
      console.log("Editing Collector with ID:", currentCollector._id); // Log ID to ensure it's correct
      await axios.put(
        `http://localhost:9500/user/update-manager/${currentCollector._id}`,
        formData
      );
      // Continue with updating state and closing modal
      toast.success("Collector updated successfully!");
      closeModals();
    } catch (error) {
      console.error("Error updating collector:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to update collector.");
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9500/user/delete/${id}`);
      setCollectors(collectors.filter((collector) => collector._id !== id));
      toast.success("Collector deleted successfully!");
    } catch (error) {
      console.error("Error:", error.response.data.error);
      toast.error("Failed to delete collector.");
    }
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("collector-table");
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

      const filename = `Collector_List_Report_${new Date().toISOString()}.pdf`;
      pdf.save(filename);
      toast.success("Report is downloading!");

      actionButtons.forEach((button) => {
        button.style.display = "inline-block";
      });
    });
  };

  const filteredCollectors = collectors.filter((collector) =>
    Object.values(collector).some(
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
            <h5 className="block font-sans text-xl font-semibold text-blue-gray-900">
              Collectors List
            </h5>
            <p className="block mt-1 text-base text-gray-700">
              See information about all collectors
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
              onClick={openAddModal}
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add Collector
            </button>
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
              onClick={handleDownloadPDF}
            >
              <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table id="collector-table" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Collector ID</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Full Name</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Contact Number</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Username</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Email</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCollectors.map((collector) => (
                <tr key={collector._id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{collector._id}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collector.fullName}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collector.contactNumber}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collector.username}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collector.email}</td>
                  <td className="py-3 px-4">
                    <button
                      className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                      title="Edit Collector"
                      onClick={() => openEditModal(collector)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                      title="Delete Collector"
                      onClick={() => handleDelete(collector._id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Collector Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={closeModals} style={customModalStyles}>
        <h2 className="text-xl font-semibold mb-4">Add Collector</h2>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} />
        <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleInputChange} />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
        <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
        <button onClick={handleAddCollector} className="rounded-lg bg-gray-900 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85]">Save</button>
        <button onClick={closeModals} className="ml-2 rounded-lg bg-red-600 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85]">Cancel</button>
      </Modal>

      {/* Edit Collector Modal */}
      <Modal isOpen={isEditModalOpen} onRequestClose={closeModals} style={customModalStyles}>
        <h2 className="text-xl font-semibold mb-4">Edit Collector</h2>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} />
        <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleInputChange} />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
        
        <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        <input type="password" name="password" placeholder="Password (leave blank to keep current)" value={formData.password} onChange={handleInputChange} />
        <button onClick={handleEditCollector} className="rounded-lg bg-gray-900 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85]">Update</button>
        <button onClick={closeModals} className="ml-2 rounded-lg bg-red-600 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85]">Cancel</button>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default CollectorList;
