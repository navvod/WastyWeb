import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link

const CustomerSidebar = () => {
  return (
    <div className="flex h-screen flex-col justify-between bg-white w-64">
      <div className="px-4 py-6">
        {/* Menu */}
        <ul className="mt-6 space-y-1">
          <li>
            <NavLink
              to="/customer/dashboard"
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
                    to="/user/allcustomers"
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`
                    }
                  >
                    Customer List
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <NavLink
              to="/user/AddProducts"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              Products
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/all-orders"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              Orders
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/send-email"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              Promotions
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerSidebar;
