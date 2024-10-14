import React from "react"
import { NavLink } from "react-router-dom"

export default function CustomerSidebar() {
  return (
    <div className="flex h-screen w-64 flex-col justify-between bg-white">
      <div className="px-4 py-6">
        <ul className="mt-6 space-y-1">
          <li>
            <NavLink
              to="/customer/dashboard"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? "bg-gray-200 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/order-device"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? "bg-gray-200 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`
              }
            >
              Order Device
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/send-schedule"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? "bg-gray-200 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`
              }
            >
              Send Special Schedule
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/collections"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? "bg-gray-200 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`
              }
            >
              Collections
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/payments"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive ? "bg-gray-200 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`
              }
            >
              Payments
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}