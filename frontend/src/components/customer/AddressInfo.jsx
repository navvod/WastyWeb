import React, { useState } from 'react';

function AddressInfo({ nextStep, prevStep, handleChange, values }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!values.address.line1) {
      newErrors.line1 = "Street Address is required";
    }

    if (!values.address.city) {
      newErrors.city = "City is required";
    }

    if (!values.address.state) {
      newErrors.state = "State is required";
    }

    if (!values.address.postalCode) {
      newErrors.postalCode = "Postal Code is required";
    } else if (!/^\d{5}$/.test(values.address.postalCode)) {
      newErrors.postalCode = "Postal Code must be a 5-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Street Address</label>
        <input
          type="text"
          placeholder="Street Address"
          value={values.address.line1}
          onChange={(e) => handleChange('address.line1', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.line1 && <p className="text-sm text-red-500">{errors.line1}</p>}
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Street Address 2</label>
        <input
          type="text"
          placeholder="Street Address 2 (Optional)"
          value={values.address.line2}
          onChange={(e) => handleChange('address.line2', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Inline fields for City and State */}
      <div className="flex space-x-4">
        <div className="flex-1 space-y-1">
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            placeholder="City"
            value={values.address.city}
            onChange={(e) => handleChange('address.city', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>
        <div className="flex-1 space-y-1">
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            placeholder="State"
            value={values.address.state}
            onChange={(e) => handleChange('address.state', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
        <input
          type="text"
          placeholder="Postal Code"
          value={values.address.postalCode}
          onChange={(e) => handleChange('address.postalCode', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
      </div>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={prevStep}
          className="w-full py-2 px-4 text-black border border-black rounded-lg hover:bg-gray-100 transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-black rounded-lg hover:bg-gray-800 transition"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default AddressInfo;
