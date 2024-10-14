import React from 'react';
import CustomerSidebar from "../../components/customer/CustomerSidebar";

function Dashboard() {
  return (
    <div>
      <div style={{ width: "250px", flexShrink: 0, backgroundColor: "#f8f9fa" }}>
        <CustomerSidebar />
      </div>
    </div>
  );
}

export default Dashboard;
