function Verification({ prevStep, handleChange, handleSubmit }) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label>NIC ID Image</label>
          <input
            type="file"
            onChange={(e) => handleChange('nicIdImage', e.target.files[0])}
            required
          />
        </div>
        <div>
          <label>Address Verification Document</label>
          <input
            type="file"
            onChange={(e) => handleChange('addressVerificationDoc', e.target.files[0])}
            required
          />
        </div>
        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit">Submit</button>
      </form>
    );
  }
  

export default Verification;
