import React, { useState } from 'react';
import './content.css';
import useEth from "../contexts/EthContext/useEth";
import { v4 as uuidv4 } from "uuid"; 

const Content = () => {
  const { state: { contract, accounts } } = useEth();
  const [currentForm, setCurrentForm] = useState(null);
  const [file, setFile] = useState(null);
  const [UUID, setUUID] = useState(null);
  const [userInputedUUID, setUserInputedUUID] = useState(null);

  const handleFileUpload = async (e)=>{
    let file = await e.target.files[0];
    setFile(file);
  }

  const getNewUUID = () => {
    const newUUID = uuidv4(); // Generate a new UUID
    return newUUID;
  };

  const uploadToBlockChain = async (id, hash)=>{
    await contract.methods.uploadHash(id, hash).send({ from: accounts[0] });
    alert("data uploaded to Blockchain");
  }

  const checkDataFromBlockChain = async (id, hash)=>{
    const isValid = await contract.methods.checkHash(id, hash).call({ from: accounts[0] });
    if(isValid === "1"){
      alert("Data is valid")
    }else{
      alert("Data has been corrupted")
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // featch the details from the form
    const fileBuffer = await file.arrayBuffer();

    // Use the SubtleCrypto API to compute the hash
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    const newUUID = getNewUUID();
    setUUID(newUUID);
    console.log(hashHex);
    console.log(newUUID);
    uploadToBlockChain(newUUID, hashHex);
    // alert('Upload form submitted successfully!');
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const fileBuffer = await file.arrayBuffer();

    // Use the SubtleCrypto API to compute the hash
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    console.log(hashHex);
    checkDataFromBlockChain(userInputedUUID, hashHex);
  };

  const renderUploadForm = () => (
    <form className="form" onSubmit={handleUploadSubmit}>
      {UUID && <h4>Please keep this Unique code with you to check the valdity {UUID} </h4>}
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
        <input type="file" name="file" required onChange={handleFileUpload} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );

  const renderVerifyForm = () => (
    <form className="form" onSubmit={handleVerifySubmit}>
      <label>
        Unique ID of the Document:
        <input type="text" name="caseId" required value={userInputedUUID} onChange={(e)=> setUserInputedUUID(e.target.value)}/>
      </label>
      <label>
        Upload File:
        <input type="file" name="file" required onChange={handleFileUpload} />
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
