import React from 'react';

function Verification({ prevStep, handleChange, handleSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">NIC ID Image</label>
        <input
          type="file"
          onChange={(e) => handleChange('nicIdImage', e.target.files[0])}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Address Verification Document</label>
        <input
          type="file"
          onChange={(e) => handleChange('addressVerificationDoc', e.target.files[0])}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          Submit
        </button>
      </div>
    </form>
  );
}

export default Verification;
