import React from 'react';

function AccountInfo({ nextStep, handleChange, values }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
      <input type="text" placeholder="Name" onChange={(e) => handleChange('name', e.target.value)} value={values.name} required />
      <input type="email" placeholder="Email" onChange={(e) => handleChange('email', e.target.value)} value={values.email} required />
      <input type="text" placeholder="Phone" onChange={(e) => handleChange('phone', e.target.value)} value={values.phone} required />
      <input type="password" placeholder="Password" onChange={(e) => handleChange('password', e.target.value)} value={values.password} required />
      <button type="submit">Next</button>
    </form>
  );
}

export default AccountInfo;
