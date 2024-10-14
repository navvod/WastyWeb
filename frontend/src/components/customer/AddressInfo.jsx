import React from 'react';

function AddressInfo({ nextStep, prevStep, handleChange, values }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
      <div>
        <label>Street Address</label>
        <input
          type="text"
          placeholder="Street Address"
          value={values.address.line1}
          onChange={(e) => handleChange('address.line1', e.target.value)}
          required
        />
      </div>
      <div>
        <label>Street Address 2</label>
        <input
          type="text"
          placeholder="Street Address 2 (Optional)"
          value={values.address.line2}
          onChange={(e) => handleChange('address.line2', e.target.value)}
        />
      </div>
      <div>
        <label>City</label>
        <input
          type="text"
          placeholder="City"
          value={values.address.city}
          onChange={(e) => handleChange('address.city', e.target.value)}
          required
        />
      </div>
      <div>
        <label>State</label>
        <input
          type="text"
          placeholder="State"
          value={values.address.state}
          onChange={(e) => handleChange('address.state', e.target.value)}
          required
        />
      </div>
      <div>
        <label>Postal Code</label>
        <input
          type="text"
          placeholder="Postal Code"
          value={values.address.postalCode}
          onChange={(e) => handleChange('address.postalCode', e.target.value)}
          required
        />
      </div>
      <button type="button" onClick={prevStep}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}

export default AddressInfo;
