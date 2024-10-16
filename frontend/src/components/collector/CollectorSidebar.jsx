import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../images/logo.png'

const CollectorSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-4 z-50 fixed top-4 left-4 bg-white rounded-full shadow-lg"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="h-6 w-6" />
      </button>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:hidden`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:static md:translate-x-0`}
      >
        <div className="px-4 py-6">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-7 w-auto" />
          </div>

          {/* Menu */}
          <ul className="mt-6 space-y-1">
            <li>
              <NavLink
                to="/collector/dashboard"
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
              <NavLink
                to="/collector/assigned-routes"
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-sm font-medium ${
                    isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`
                }
              >
                Assigned Routes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/collector/waste-collection-form"
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-sm font-medium ${
                    isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`
                }
              >
                Waste Collection
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CollectorSidebar;
