import { useContext, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Upload, FileCheck, Trash2, FileX, AlertCircle, CheckCircle, Upload as UploadIcon, Loader } from "lucide-react";

const FileUpload = () => {
  const { uploadFile, isLoggedin, userData } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setMessage("");
    
    if (!selectedFile) return;
    
    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setMessage("Please select an Excel file (.xlsx or .xls)");
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
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
      setMessage("Please select a file");
      return;
    }
    
    setIsLoading(true);
    setMessage("Uploading file...");
    
    try {
      const response = await uploadFile(file);
      
      if (response.success) {
        const processedCount = response.questionsCount || 0;
        setMessage(`File uploaded successfully! ${processedCount} questions processed.`);
        toast.success("File uploaded successfully!");
        
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(response.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      const errorMessage = error.response?.data?.error || error.message || "File upload failed";
      const missingHeaders = error.response?.data?.missingHeaders;
      
      if (missingHeaders && missingHeaders.length) {
        setMessage(`${errorMessage}: ${missingHeaders.join(', ')}`);
        toast.error("Excel file is missing required headers");
      } else {
        setMessage(`${errorMessage}`);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const requiredHeaders = [
    "Subject Code", "Subject", "Branch", "Regulation", 
    "Year", "Sem", "Month", "Unit", "B.T Level"
  ];

  return (
    <div className="max-w-xl mt-20 mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-6 text-white">
          <h2 className="text-2xl font-bold">Question Bank Upload</h2>
          <p className="mt-1 text-sm opacity-90">Upload your formatted Excel file containing questions</p>
        </div>
        
        <div className="p-6">
          <div 
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              dragActive 
                ? "border-indigo-500 bg-indigo-50" 
                : file 
                  ? "border-emerald-400 bg-emerald-50" 
                  : "border-gray-200 hover:border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <div className="mb-3">
                  <FileCheck size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB • Excel file
                </p>
                <button 
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    setMessage("");
                  }}
                  className="mt-4 flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center">
                  <div className="mb-3">
                    <Upload size={40} className="text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Drag & Drop your Excel file</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    or <span className="text-indigo-600 font-medium">browse files</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports .xlsx and .xls formats
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-5 bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Required Excel Headers:</h4>
            <div className="flex flex-wrap gap-2">
              {requiredHeaders.map((header) => (
                <span key={header} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-md">
                  {header}
                </span>
              ))}
            </div>
          </div>
          
          {message && (
            <div className={`mt-5 p-4 rounded-lg text-sm flex items-start ${
              message.includes('successfully') 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                : message.includes('failed')
                  ? 'bg-red-50 text-red-800 border border-red-100'
                  : 'bg-blue-50 text-blue-800 border border-blue-100'
            }`}>
              <span className="flex-shrink-0 mr-2">
                {message.includes('successfully') ? (
                  <CheckCircle size={18} />
                ) : message.includes('failed') ? (
                  <FileX size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
              </span>
              <span>{message}</span>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className={`mt-5 w-full flex items-center justify-center py-3 px-4 rounded-md text-white font-medium transition-all ${
              isLoading || !file
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                Processing Upload...
              </>
            ) : (
              <>
                <UploadIcon size={18} className="mr-2" />
                Upload Question Bank
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;