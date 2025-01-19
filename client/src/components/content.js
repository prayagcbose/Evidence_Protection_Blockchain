import React, { useState } from 'react';
import './content.css';

const Content = () => {
  const [currentForm, setCurrentForm] = useState(null);

  const handleUploadSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    alert('Upload form submitted successfully!');
    setCurrentForm(null); // Close the form
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    alert('Verify form submitted successfully!');
    setCurrentForm(null); // Close the form
  };

  const renderUploadForm = () => (
    <form className="form" onSubmit={handleUploadSubmit}>
      <label>
        Name:
        <input type="text" name="name" required />
      </label>
      <label>
        File Type:
        <select name="fileType" required style={{ width: '100%', height: '38px' }}>
          <option value="">Select file type</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="audio">Audio</option>
          <option value="document">Document</option>
        </select>
      </label>
      <label>
        Upload File:
        <input type="file" name="file" required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );

  const renderVerifyForm = () => (
    <form className="form" onSubmit={handleVerifySubmit}>
      <label>
        Case ID:
        <input type="text" name="caseId" required />
      </label>
      <label>
        Upload File:
        <input type="file" name="file" required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );

  return (
    <div className="container">
      <div className="card" onClick={() => setCurrentForm('upload')}>
        Upload
      </div>
      <div className="card" onClick={() => setCurrentForm('verify')}>
        Verify
      </div>
      <div className="form-container">
        {currentForm === 'upload' && renderUploadForm()}
        {currentForm === 'verify' && renderVerifyForm()}
      </div>
    </div>
  );
};

export default Content;
