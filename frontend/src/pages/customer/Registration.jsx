import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountInfo from '../../components/customer/AccountInfo';
import AddressInfo from '../../components/customer/AddressInfo';
import Verification from '../../components/customer/Verification';
import axios from 'axios';

function Registration() {
  const navigate = useNavigate();  // Initialize navigate

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: { line1: '', line2: '', city: '', state: '', postalCode: '' },
    nicIdImage: null,
    addressVerificationDoc: null,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (input, value) => {
    if (input.startsWith('address.')) {
      const addressField = input.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [input]: value });
    }
  };

  const handleSubmit = () => {
    const form = new FormData();
    
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('password', formData.password);
    
    Object.keys(formData.address).forEach((key) => {
      form.append(`address.${key}`, formData.address[key]);
    });
    
    form.append('nicIdImage', formData.nicIdImage);
    form.append('addressVerificationDoc', formData.addressVerificationDoc);
    
    // Log FormData content for debugging
    for (let pair of form.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    axios.post('http://localhost:9500/customer/register', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response.data);
      alert('Registration successful');
      navigate('/customer/login');  // Redirect to login page upon success
    })
    .catch((error) => {
      console.error("Error submitting form:", error);
      alert('Registration failed');
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AccountInfo nextStep={nextStep} handleChange={handleChange} values={formData} />;
      case 2:
        return <AddressInfo nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} />;
      case 3:
        return <Verification prevStep={prevStep} handleChange={handleChange} handleSubmit={handleSubmit} values={formData} />;
      default:
        return <AccountInfo nextStep={nextStep} handleChange={handleChange} values={formData} />;
    }
  };

  return (
    <div>
      {/* Stepper Component */}
      <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
        <li className={`flex md:w-full items-center ${step >= 1 ? 'text-blue-600 dark:text-blue-500' : ''}`}>
          <span className="flex items-center">1 Account Info</span>
        </li>
        <li className={`flex md:w-full items-center ${step >= 2 ? 'text-blue-600 dark:text-blue-500' : ''}`}>
          <span className="flex items-center">2 Address Info</span>
        </li>
        <li className={`flex items-center ${step === 3 ? 'text-blue-600 dark:text-blue-500' : ''}`}>
          <span className="flex items-center">3 Verification</span>
        </li>
      </ol>

      {/* Render Step Components */}
      {renderStep()}
    </div>
  );
}

export default Registration;
