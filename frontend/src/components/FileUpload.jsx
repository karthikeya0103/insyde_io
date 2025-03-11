import { useState, useCallback } from "react";
import axios from "axios";

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (selectedFile) => {
    if (!selectedFile.name.toLowerCase().endsWith(".stl")) {
      setError("Only .stl files are allowed");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setError(null);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpload(response.data.filename, file.name);
    } catch (err) {
      setError("Error uploading file. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 ${
          isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
        } border-dashed rounded-lg p-6 text-center transition-all duration-200 ease-in-out hover:bg-gray-50`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center justify-center h-40 w-full cursor-pointer">
          <div className="flex flex-col items-center justify-center">
            <svg
              className={`w-10 h-10 mb-3 ${file ? "text-blue-600" : "text-gray-400"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-700 font-semibold">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-gray-500">Only .stl files are allowed</p>
          </div>
          <input type="file" className="hidden" accept=".stl" onChange={handleFileChange} />
        </label>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-100 px-4 py-2 rounded-lg flex items-center shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {file && !error && (
        <div className="flex items-center space-x-3 text-sm text-gray-700 border border-gray-300 bg-gray-100 px-4 py-2 rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="truncate max-w-[250px]">{file.name}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`w-full flex justify-center items-center px-5 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
          loading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          "Upload File"
        )}
      </button>
    </div>
  );
};

export default FileUpload;
