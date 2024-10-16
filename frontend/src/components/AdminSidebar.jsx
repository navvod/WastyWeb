import React from "react";
import { NavLink } from "react-router-dom";
import Logo from '../images/logo.png'


const AdminSidebar = () => {
  return (
    <div className="flex h-screen flex-col justify-between bg-white w-64">
      <div className="px-4 py-6">
      <div className="mb-12 flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-7 w-auto" />
          </div>
        {/* Menu */}
        <ul className="mt-6 space-y-1">
          <li>
            <NavLink
              to="/user/overview"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium">Manage Users</span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <NavLink
                    to="/user/allAdmins"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Admin List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/allcollectors"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Collector List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/customers"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Customer List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/customer-approval"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Pending Approvals
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <NavLink
              to="/routeManagement/RouteHome"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              Route Management
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/collection/AllCollection"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              Collections
            </NavLink>
          </li>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium">Payments</span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <NavLink
                    to="/payments/SingleCollectionPayment"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Single Payment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/payment/MonthlyPayment"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Monthly Payments
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium">Reports</span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <NavLink
                    to="/reports/collection"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Collection Report
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/reports/recycling"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Recycling Rate
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/reports/highWaste"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    High Waste Area Report
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
