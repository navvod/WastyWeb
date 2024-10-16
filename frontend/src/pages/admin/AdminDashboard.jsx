import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';

function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-grow p-6 lg:ml-128 lg:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Statistics</h2>
            <p>Total Users: 150</p>
            <p>New Users Today: 5</p>
            <p>Active Users: 120</p>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
            <ul className="list-disc list-inside">
              <li>User JohnDoe created a post.</li>
              <li>User JaneSmith updated their profile.</li>
              <li>User Admin approved a new user.</li>
            </ul>
          </div>

          {/* System Status */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
            <p>Server Status: <span className="text-green-600">Online</span></p>
            <p>Database Status: <span className="text-green-600">Connected</span></p>
            <p>API Requests: 350</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
