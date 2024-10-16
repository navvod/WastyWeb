import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerSidebar from '../../../components/customer/CustomerSidebar';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SpecialCollectionList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const customerId = localStorage.getItem('customerId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`/special-collections/customer/${customerId}`);
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load requests');
        setLoading(false);
      }
    };
    fetchRequests();
  }, [customerId]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await axios.delete(`/special-collections/${id}`);
        setRequests(requests.filter(request => request._id !== id));
        toast.success("Request deleted successfully");
      } catch (error) {
        toast.error("Failed to delete request");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/customer/special-request/edit/${id}`);
  };

  const handleAddNewRequest = () => {
    navigate(`/customer/special_request`);
  };

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen">
      <div className="">
        <CustomerSidebar />
      </div>

      <div className="flex-grow p-6 bg-gray-100 lg:ml-128 lg:p-10">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">My Special Collection Requests</h1>
          <button
            onClick={handleAddNewRequest}
            className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85]"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New Request</span>
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead >
                <tr>
                  <th className="hidden sm:table-cell px-2 sm:px-4 py-2 text-left font-medium text-gray-700">Request Type</th>
                  <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">Notes</th>
                  <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">Date Requested</th>
                  <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">Status</th>
                  <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="hidden sm:table-cell px-2 sm:px-4 py-2">{request.requestType}</td>
                    <td className="px-2 sm:px-4 py-2">{request.notes}</td>
                    <td className="px-2 sm:px-4 py-2">{new Date(request.dateRequested).toLocaleDateString()}</td>
                    <td className="px-2 sm:px-4 py-2">
                      <span className={`px-2 py-1 rounded ${request.status === 'Approved' ? 'bg-green-100 text-green-600' : request.status === 'Denied' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 flex justify-center">
  <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
    {/* Edit Button */}
    <button
      className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative"
      title="Edit Request"
      onClick={() => handleEdit(request._id)}
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
      title="Delete Request"
      onClick={() => handleDelete(request._id)}
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
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default SpecialCollectionList;
