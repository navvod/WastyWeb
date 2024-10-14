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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
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

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null); // Clear the selected admin data
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

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9500/user/update-admin/${selectedAdmin.Id}`, selectedAdmin);
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) => (admin.Id === selectedAdmin.Id ? selectedAdmin : admin))
      );
      toast.success("Admin updated successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error.response.data.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
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
            <h5 className="text-xl font-semibold text-blue-gray-900">Admins List</h5>
            <p className="mt-1 text-base text-gray-700">See information about all admins</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Add Admin Button */}
            <button
              className="flex items-center gap-3 bg-customGreen text-white py-2 px-4 rounded-lg font-bold uppercase text-xs"
              onClick={() => navigate("/user/register-admin")}
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              Add Admin
            </button>
          </div>
        </div>

        {/* Admin Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table id="admin-table" className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-900">Admin ID</th>
                <th className="px-4 py-2 font-medium text-gray-900">Full Name</th>
                <th className="px-4 py-2 font-medium text-gray-900">Contact Number</th>
                <th className="px-4 py-2 font-medium text-gray-900">Username</th>
                <th className="px-4 py-2 font-medium text-gray-900">Email</th>
                <th className="px-4 py-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.Id}>
                  <td className="px-4 py-2 font-medium text-gray-900">{admin.Id}</td>
                  <td className="px-4 py-2 text-gray-700">{admin.fullName}</td>
                  <td className="px-4 py-2 text-gray-700">{admin.contactNumber}</td>
                  <td className="px-4 py-2 text-gray-700">{admin.username}</td>
                  <td className="px-4 py-2 text-gray-700">{admin.email}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleEdit(admin)} className="text-blue-500">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(admin.Id)} className="text-red-500 ml-2">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Admin</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-sm">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={selectedAdmin.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={selectedAdmin.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Username</label>
                <input
                  type="text"
                  name="username"
                  value={selectedAdmin.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedAdmin.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={handleCloseModal} className="py-2 px-4 bg-gray-400 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default AdminList;
