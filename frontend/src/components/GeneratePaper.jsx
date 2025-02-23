import React, { useState, useEffect, useContext } from "react";
import { Loader2 } from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from 'axios';

const GeneratePaper = ({ setQuestions }) => {
  const { backendUrl, generatePaper, isLoggedin, userData } = useContext(AppContext);

  const [filters, setFilters] = useState({
    subject: "",
    branch: "",
    regulation: "",
    year: "",
    semester: "",
    unit: "",
  });

  const [generationMode, setGenerationMode] = useState({
    short: "total", // 'total' or 'unitWise'
    long: "total",
  });

  const [useBtLevels, setUseBtLevels] = useState({
    short: false,
    long: false,
  });

  const [totalCounts, setTotalCounts] = useState({
    short: 0,
    long: 0,
  });

  const [btLevels, setBtLevels] = useState({
    short: [
      { level: 1, count: 0 },
      { level: 2, count: 0 },
      { level: 3, count: 0 },
      { level: 4, count: 0 },
    ],
    long: [
      { level: 1, count: 0 },
      { level: 2, count: 0 },
      { level: 3, count: 0 },
      { level: 4, count: 0 },
    ],
  });

  const [unitCounts, setUnitCounts] = useState({
    short: Array(5)
      .fill(0)
      .map((_, i) => ({ unit: i + 1, count: 0 })),
    long: Array(5)
      .fill(0)
      .map((_, i) => ({ unit: i + 1, count: 0 })),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (isLoggedin && userData) {
      fetchSubjects();
      fetchUploadedFiles();
    }
  }, [isLoggedin, userData]);

  const fetchSubjects = async () => {
    try {
      if (!selectedFile) {
        return;
      }
      const response = await axios.get(`${backendUrl}/api/generate/subjects/${selectedFile}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      
      if (response.data.subjects && Array.isArray(response.data.subjects)) {
        setSubjects(response.data.subjects);
      } else {
        throw new Error("Invalid API response: Expected an array of subjects");
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError(`Failed to fetch subjects: ${err.response?.data?.error || err.message || "Unknown error"}`);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/upload/files`, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      setUploadedFiles(response.data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError(error.response?.data?.error || 'Failed to fetch files');
    }
  };

  useEffect(() => {
    if (selectedFile) {
      fetchSubjects();
    }
  }, [selectedFile]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleModeChange = (type, mode) => {
    setGenerationMode((prev) => ({
      ...prev,
      [type]: mode,
    }));
  };

  const handleBtLevelToggle = (type) => {
    setUseBtLevels((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleTotalCountChange = (type, count) => {
    setTotalCounts((prev) => ({
      ...prev,
      [type]: parseInt(count) || 0,
    }));
  };

  const handleBTLevelChange = (type, level, count) => {
    setBtLevels((prev) => ({
      ...prev,
      [type]: prev[type].map((bt) =>
        bt.level === level ? { ...bt, count: parseInt(count) || 0 } : bt
      ),
    }));
  };

  const handleUnitCountChange = (type, unit, count) => {
    setUnitCounts((prev) => ({
      ...prev,
      [type]: prev[type].map((u) =>
        u.unit === unit ? { ...u, count: parseInt(count) || 0 } : u
      ),
    }));
  };

  const getUniqueValues = (field) => {
    const values = subjects.flatMap((s) =>
      Array.isArray(s[field]) ? s[field] : [s[field]]
    );
    const uniqueValues = [...new Set(values)];
    return uniqueValues.sort((a, b) =>
      isNaN(a) ? a.localeCompare(b) : Number(a) - Number(b)
    );
  };

  const validateConfig = (config, type) => {
    if (!config[type].useUnitWise && config[type].useBtLevels) {
      const totalBtCount = Object.values(config[type].btLevelCounts).reduce(
        (a, b) => a + b,
        0
      );
      if (totalBtCount !== config[type].totalCount) {
        throw new Error(
          `For ${type} questions: Total questions (${config[type].totalCount}) must match total BT level questions (${totalBtCount})`
        );
      }
    }

    if (config[type].useUnitWise) {
      const totalUnitCount = Object.values(config[type].unitCounts).reduce(
        (a, b) => a + b,
        0
      );
      if (config[type].useBtLevels) {
        const totalBtCount = Object.values(config[type].btLevelCounts).reduce(
          (a, b) => a + b,
          0
        );
        if (totalUnitCount !== totalBtCount) {
          throw new Error(
            `For ${type} questions: Total unit-wise count (${totalUnitCount}) must match total BT level count (${totalBtCount})`
          );
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedin || !userData) {
        setError("Please log in to generate a paper");
        return;
    }

    if (!userData.isAccountVerified) {
        setError("Please verify your account before generating a paper");
        return;
    }

    setLoading(true);
    setError(null);

    if (!selectedFile) {
        setError('Please select a question bank file');
        setLoading(false);
        return;
    }

    try {
        // Validate configurations before making API call
        const config = {
            short: {
                useUnitWise: generationMode.short === 'unitWise',
                useBtLevels: useBtLevels.short,
                totalCount: totalCounts.short,
                btLevelCounts: Object.fromEntries(
                    btLevels.short.filter(bt => bt.count > 0).map(bt => [bt.level, bt.count])
                ),
                unitCounts: Object.fromEntries(
                    unitCounts.short.filter(u => u.count > 0).map(u => [u.unit, u.count])
                )
            },
            long: {
                useUnitWise: generationMode.long === 'unitWise',
                useBtLevels: useBtLevels.long,
                totalCount: totalCounts.long,
                btLevelCounts: Object.fromEntries(
                    btLevels.long.filter(bt => bt.count > 0).map(bt => [bt.level, bt.count])
                ),
                unitCounts: Object.fromEntries(
                    unitCounts.long.filter(u => u.count > 0).map(u => [u.unit, u.count])
                )
            }
        };

        // // Pre-submission validation
        // if (config.short.totalCount === 0 && config.long.totalCount === 0) {
        //     throw new Error("Please specify at least one question count (short or long)");
        // }

        // Validate configurations
        validateConfig(config, "short");
        validateConfig(config, "long");

        const requestData = {
            ...filters,
            fileId: selectedFile,
            config
        };

        console.log('Request data:', JSON.stringify(requestData, null, 2));
        
        const response = await generatePaper(requestData);

        if (!response) {
            throw new Error("No response received from server");
        }

        if (!response.shortAnswers && !response.longAnswers) {
            throw new Error("No questions were generated");
        }

        setQuestions(response);
    } catch (err) {
        console.error("Error generating paper:", err);
        const errorMessage = err.response?.data?.error || err.message || "Failed to generate paper";
        const errorDetails = err.response?.data?.details;
        
        setError(`${errorMessage}${errorDetails ? `\n\nDetails: ${errorDetails}` : ''}`);
    } finally {
        setLoading(false);
    }
};


  const renderQuestionConfig = (type) => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="total"
            checked={generationMode[type] === "total"}
            onChange={(e) => handleModeChange(type, e.target.value)}
            className="mr-2"
          />
          Total Count
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="unitWise"
            checked={generationMode[type] === "unitWise"}
            onChange={(e) => handleModeChange(type, e.target.value)}
            className="mr-2"
          />
          Unit-wise
        </label>
      </div>

      <div className="flex items-center mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useBtLevels[type]}
            onChange={() => handleBtLevelToggle(type)}
            className="mr-2"
          />
          Use BT Levels
        </label>
      </div>

      {generationMode[type] === "total" && (
        <div className="flex flex-col">
          <label className="text-sm mb-1">Total Questions</label>
          <input
            type="number"
            min="0"
            value={totalCounts[type]}
            onChange={(e) => handleTotalCountChange(type, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      )}

      {useBtLevels[type] && (
        <div className="grid grid-cols-4 gap-4">
          {btLevels[type].map((bt) => (
            <div key={bt.level} className="flex flex-col">
              <label className="text-sm mb-1">BT Level {bt.level}</label>
              <input
                type="number"
                min="0"
                value={bt.count}
                onChange={(e) =>
                  handleBTLevelChange(type, bt.level, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>
      )}

      {generationMode[type] === "unitWise" && (
        <div className="grid grid-cols-5 gap-4">
          {unitCounts[type].map((unit) => (
            <div key={unit.unit} className="flex flex-col">
              <label className="text-sm mb-1">Unit {unit.unit}</label>
              <input
                type="number"
                min="0"
                value={unit.count}
                onChange={(e) =>
                  handleUnitCountChange(type, unit.unit, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // If not logged in or no user data
  if (!isLoggedin || !userData) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-xl font-semibold text-red-600 mb-4">
            Login Required
          </div>
          <p className="text-center text-gray-700">
            Please log in to generate a paper. If you don't have an account,
            please sign up first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Question Bank</label>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Question Bank</option>
            {uploadedFiles.map((file) => (
              <option key={file._id} value={file._id}>
                {file.filename} ({new Date(file.uploadDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {/* Filter Selections */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Branch</label>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Branch</option>
              {getUniqueValues("branch").map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Regulation</label>
            <select
              name="regulation"
              value={filters.regulation}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Regulation</option>
              {getUniqueValues("regulation").map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Year</option>
              {getUniqueValues("year").map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Semester</option>
              {getUniqueValues("semester").map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Subject</option>
              {subjects
                .filter(
                  (s) =>
                    (!filters.branch || s.branch === filters.branch) &&
                    (!filters.regulation ||
                      s.regulation === filters.regulation) &&
                    (!filters.year ||
                      (Array.isArray(s.year)
                        ? s.year.includes(filters.year)
                        : s.year === filters.year)) &&
                    (!filters.semester ||
                      (Array.isArray(s.semester)
                        ? s.semester.includes(Number(filters.semester))
                        : s.semester === Number(filters.semester)))
                )
                .map((s) => (
                  <option key={s.subjectCode} value={s.subjectCode}>
                    {s.subject} ({s.subjectCode})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              name="unit"
              value={filters.unit}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Units</option>
              {[1, 2, 3, 4, 5].map((unit) => (
                <option key={unit} value={unit}>
                  Unit {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Question Configuration */}
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="font-semibold mb-3">Short Answer Questions</h3>
            {renderQuestionConfig("short")}
          </div>

          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="font-semibold mb-3">Long Answer Questions</h3>
            {renderQuestionConfig("long")}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Paper"
          )}
        </button>
      </form>
    </div>
  );
};

export default GeneratePaper;