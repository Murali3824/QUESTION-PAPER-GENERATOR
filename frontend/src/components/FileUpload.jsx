import { useContext, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const FileUpload = () => {
  const { uploadFile, isLoggedin, userData } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // File size limit (5MB)
  // const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Reset message when new file is selected
    setMessage("");
    
    if (!selectedFile) {
      return;
    }
    
    // Check file type
    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setMessage("❌ Please select an Excel file (.xlsx or .xls)");
      setFile(null);
      return;
    }
    
    // Check file size
    // if (selectedFile.size > MAX_FILE_SIZE) {
    //   setMessage(`❌ File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    //   setFile(null);
    //   return;
    // }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!isLoggedin) {
      toast.error("Please log in to upload files");
      return;
    }
    
    if (!userData.isAccountVerified) {
      toast.error("Please verify your account before uploading files");
      return;
    }
    
    if (!file) {
      setMessage("❌ Please select a file");
      return;
    }
    
    setIsLoading(true);
    setMessage("Uploading file...");
    
    try {
      const response = await uploadFile(file);
      
      if (response.success) {
        const processedCount = response.questionsCount || 0;
        setMessage(`✅ File uploaded successfully! ${processedCount} questions processed.`);
        toast.success("File uploaded successfully!");
        
        // Reset file input
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(response.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      const errorMessage = error.response?.data?.error || error.message || "❌ File upload failed";
      const missingHeaders = error.response?.data?.missingHeaders;
      
      if (missingHeaders && missingHeaders.length) {
        setMessage(`${errorMessage}: ${missingHeaders.join(', ')}`);
        toast.error("Excel file is missing required headers");
      } else {
        setMessage(`❌ ${errorMessage}`);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderFilePreview = () => {
    if (!file) return null;
    
    return (
      <div className="flex items-center mt-2 p-2 bg-gray-50 rounded">
        <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm text-gray-600 truncate max-w-xs">{file.name}</span>
        <span className="text-xs text-gray-500 ml-2">
          ({(file.size / 1024).toFixed(1)} KB)
        </span>
        <button
          onClick={() => {
            setFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setMessage("");
          }}
          className="ml-auto text-red-500 hover:text-red-700"
          title="Remove file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Question Bank</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excel File (.xlsx, .xls)
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          ref={fileInputRef}
          disabled={isLoading}
        />
        {renderFilePreview()}
      </div>
      
      <div className="text-xs text-gray-500 mb-4">
        <p>* File must be Excel format (.xlsx or .xls)</p>
        {/* <p>* Maximum file size: 5MB</p> */}
        <p>* Required columns: Subject Code, Subject, Branch, Regulation, Year, Sem, Month, Unit, B.T Level</p>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={isLoading || !file}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
          isLoading || !file
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </div>
        ) : 'Upload File'}
      </button>
      
      {message && (
        <div className={`mt-4 p-3 rounded text-sm ${
          message.includes('✅') 
            ? 'bg-green-50 text-green-800' 
            : message.includes('❌')
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;