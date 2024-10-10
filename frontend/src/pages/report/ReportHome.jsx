import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';

function ReportHome() {
  const navigate = useNavigate();

  const handleCollectionReport = () => {
    navigate('/reports/collection'); // Update to your actual route for Collection Report
  };

  const handleRecyclingRate = () => {
    navigate('/reports/recycling'); // Update to your actual route for Recycling Rate Report
  };

  const handleHighWasteAreaReport = () => {
    navigate('/reports/highWaste'); // Update to your actual route for High Waste Area Report
  };

  const handleBack = () => {
    navigate('/'); // Navigate back to the home page or relevant page
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2 className="text-center">Reports</h2>
          <button className="btn btn-secondary mb-3" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </button>
          <div className="text-center">
            <button className="btn btn-primary mb-3 mx-2" onClick={handleCollectionReport}>
              Collection Report
            </button>
            <button className="btn btn-primary mb-3 mx-2" onClick={handleRecyclingRate}>
              Recycling Rate
            </button>
            <button className="btn btn-primary mb-3 mx-2" onClick={handleHighWasteAreaReport}>
              High Waste Area Report
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ReportHome;
