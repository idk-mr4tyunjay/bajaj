import React, { useState } from 'react';

const JSONInput = ({ onSubmit }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result.split(',')[1]); // Extract Base64 string
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedJSON = JSON.parse(jsonInput); // Validate JSON
      const payload = {
        ...parsedJSON,
        file_b64: file || null, // Include Base64 if file exists
      };
      setError(null);
      onSubmit(JSON.stringify(payload));
    } catch {
      setError('Invalid JSON format!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="form-control"
        rows="5"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON (e.g., {"data": ["A", "1"]})'
      />
      <input
        type="file"
        className="form-control mt-3"
        onChange={handleFileChange}
      />
      {error && <div className="text-danger mt-2">{error}</div>}
      <button type="submit" className="btn btn-primary mt-3">Submit</button>
    </form>
  );
};

export default JSONInput;
