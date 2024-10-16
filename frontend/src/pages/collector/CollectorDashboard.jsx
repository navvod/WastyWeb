import React from 'react';
import CollectorSidebar from '../../components/collector/CollectorSidebar';

function CollectorDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <CollectorSidebar />

      {/* Main Content Area */}
      <div className="flex-grow p-6 bg-gray-100 lg:ml-128 lg:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Collector Dashboard</h1>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Assigned Tasks */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Assigned Tasks</h2>
            <p>Total Tasks: 8</p>
            <p>Completed Tasks: 5</p>
            <p>Pending Tasks: 3</p>
          </div>

          {/* Recent Collections */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Collections</h2>
            <ul className="list-disc list-inside">
              <li>Location A: 15 items collected</li>
              <li>Location B: 10 items collected</li>
              <li>Location C: 20 items collected</li>
            </ul>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h2>
            <p>Collection Rate: 80%</p>
            <p>On-Time Completion: 90%</p>
            <p>Customer Satisfaction: 85%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectorDashboard;
