import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import './App.css';


import Test from "./components/test"

//Admin and collector
import AdminRegister from "./pages/admin/AdminRegister";
import AdminList from "./pages/admin/AdminList";
import EditAdmin from "./pages/admin/EditAdmin";
import CollectorRegister from "./pages/collector/CollectorRegister";
import CollectorList from "./pages/collector/CollectorList";
import EditCollector from "./pages/collector/EditCollector";


//RouteManagement
import AddRoute from "./pages/routeManagement/AddRoute";
import RouteHome from "./pages/routeManagement/RouteHome";
import UpdateRoute from "./pages/routeManagement/UpdateRoute"
import AssignRoute from "./pages/routeManagement/AssignRoute"
import AllAssignedRoute from "./pages/routeManagement/AllAssignedRoutes";

//Collection
import CollectionHome from "./pages/payment/CollectionHome";
import SinglePayment from "./pages/payment/SinglePayment"
import MonthlyPayment from "./pages/payment/MonthlyPayment"


//Reports
import ReportHome from "./pages/report/ReportHome";
import CollectionReport from "./pages/report/CollectionReportPage";
import HighWasteReport from "./pages/report/HighWasteAreasReportPage";
import RecyclingReport from "./pages/report/RecyclingRateReportPage"


import Charts from "./pages/charts/ChartsPage"





function App() {

  axios.defaults.baseURL = "http://localhost:9500"; //  backend server URL
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>

       {/* Admin and Collector  */}
      <Route path="/user/register-admin" element={<AdminRegister />} />
      <Route path="/user/allAdmins" element={<AdminList />} />
      <Route path="/user/update-admin/:Id" element={<EditAdmin />} />

      <Route path="/user/register-collector" element={<CollectorRegister />} />
      <Route path="/user/allcollectors" element={<CollectorList />} />
      <Route path="/user/update-collector/:Id" element={<EditCollector />} />

       {/* Route Management  */}
      <Route path="/Test" element={<Test />} />
      <Route path="/routeManagement/AddRoute" element={<AddRoute />} />
      <Route path="/routeManagement/RouteHome" element={<RouteHome />} />
      <Route path="/routeManagement/AssignRoute/:routeId" element={<AssignRoute />} />
      <Route path="/routeManagement/ALlAssignedRoutes" element={<AllAssignedRoute />} />
      <Route path="/routeManagement/UpdateRoute/:id" element={<UpdateRoute />} />


      {/* Payment Management  */}
      <Route path="/payments/AllCollection" element={<CollectionHome />} />
      <Route path="/payment/viewSingleCollectionPayment/:userId/:collectionId" element={<SinglePayment />} />
      <Route path="/payment/MonthlyPayment" element={<MonthlyPayment />} />


     {/* Reports  */}
     <Route path="/reports/ReportHome" element={<ReportHome />} />
     <Route path="/reports/collection" element={<CollectionReport />} />
     <Route path="/reports/highWaste" element={<HighWasteReport />}/>
     <Route path="/reports/recycling" element={<RecyclingReport />}/>

     {/* Charts  */}
     <Route path="/charts/chartsHome" element={<Charts />}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
