import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from 'axios';
import { FileSpreadsheet, Loader, AlertTriangle, Settings, BookOpen, ChevronDown, ChevronUp, BarChart2, FileText, CheckCircle, HelpCircle, Sliders } from "lucide-react";

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
    short: "total",
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
  const [shortAnswerOpen, setShortAnswerOpen] = useState(true);
  const [longAnswerOpen, setLongAnswerOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    if (isLoggedin && userData) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg">
          <h4 className="text-gray-700 font-medium mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2 text-teal-400" />
            Generation Mode
          </h4>
          <div className="space-y-2">
            <label className="flex items-center text-gray-800 hover:text-gray-900 cursor-pointer">
              <input
                type="radio"
                value="total"
                checked={generationMode[type] === "total"}
                onChange={() => handleModeChange(type, "total")}
                className="mr-2 accent-teal-500"
              />
              Total Count
            </label>
            <label className="flex items-center text-gray-800 hover:text-gray-900 cursor-pointer">
              <input
                type="radio"
                value="unitWise"
                checked={generationMode[type] === "unitWise"}
                onChange={() => handleModeChange(type, "unitWise")}
                className="mr-2 accent-teal-500"
              />
              Unit-wise Distribution
            </label>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <h4 className="text-gray-700 font-medium mb-3 flex items-center">
            <BarChart2 className="w-4 h-4 mr-2 text-teal-400" />
            Bloom's Taxonomy
          </h4>
          <label className="flex items-center text-gray-800 hover:text-gray-900 cursor-pointer">
            <input
              type="checkbox"
              checked={useBtLevels[type]}
              onChange={() => handleBtLevelToggle(type)}
              className="mr-2 accent-teal-500 h-5 w-5"
            />
            Use BT Levels for Selection
          </label>
          {useBtLevels[type] && (
            <p className="text-xs text-gray-900 mt-2">
              Specify how many questions from each Bloom's Taxonomy level
            </p>
          )}
        </div>
      </div>

      {generationMode[type] === "total" && (
        <div className="bg-white p-4 rounded-lg">
          <h4 className="text-gray-700 font-medium mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-teal-400" />
            Total Questions
          </h4>
          <input
            type="number"
            min="0"
            value={totalCounts[type]}
            onChange={(e) => handleTotalCountChange(type, e.target.value)}
            className="w-full p-3  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      )}

      {useBtLevels[type] && (
        <div className="bg-white p-4 rounded-lg">
          <h4 className="text-gray-700 font-medium mb-3 flex items-center">
            <BarChart2 className="w-4 h-4 mr-2 text-teal-400" />
            BT Level Distribution
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {btLevels[type].map((bt) => (
              <div key={bt.level} className="flex flex-col">
                <label className="text-sm text-gray-800 mb-1">Level {bt.level}</label>
                <input
                  type="number"
                  min="0"
                  value={bt.count}
                  onChange={(e) => handleBTLevelChange(type, bt.level, e.target.value)}
                  className="w-full p-2  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {generationMode[type] === "unitWise" && (
        <div className="bg-white p-4 rounded-lg">
          <h4 className="text-gray-700 font-medium mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-teal-400" />
            Unit-wise Distribution
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {unitCounts[type].map((unit) => (
              <div key={unit.unit} className="flex flex-col">
                <label className="text-sm text-gray-800 mb-1">Unit {unit.unit}</label>
                <input
                  type="number"
                  min="0"
                  value={unit.count}
                  onChange={(e) => handleUnitCountChange(type, unit.unit, e.target.value)}
                  className="w-full p-2  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // If not logged in or no user data
  if (!isLoggedin || !userData) {
    return (
      <div className="max-w-4xl mt-20 mx-auto">
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
            <p className="text-center text-gray-900 max-w-md">
              Please log in to generate a question paper. If you don't have an account,
              please sign up first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-20 mx-auto">
      <div className="bg-white rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-teal-400" />
            Question Paper Generator
          </h2>
          <p className="text-white text-sm mt-1">
            Create customized question papers based on your uploaded question banks
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border bottom-1 rounded-lg overflow-hidden">
              <button 
                type="button"
                className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-750"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <div className="flex items-center">
                  <Sliders className="w-5 h-5 mr-2 text-teal-400" />
                  <span className="font-medium text-gray-900">Question Paper Criteria</span>
                </div>
                {filtersOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-900" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-900" />
                )}
              </button>
              
              {filtersOpen && (
                <div className="p-4 bg-gray-850 space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Select Question Bank
                    </label>
                    <select
                      value={selectedFile}
                      onChange={(e) => setSelectedFile(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
            
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Branch</label>
                      <select
                        name="branch"
                        value={filters.branch}
                        onChange={handleFilterChange}
                        className="w-full p-3  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-800 mb-2">Regulation</label>
                      <select
                        name="regulation"
                        value={filters.regulation}
                        onChange={handleFilterChange}
                        className="w-full p-3  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-800 mb-2">Year</label>
                      <select
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        className="w-full p-3  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-800 mb-2">Semester</label>
                      <select
                        name="semester"
                        value={filters.semester}
                        onChange={handleFilterChange}
                        className="w-full p-3  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-800 mb-2">Subject</label>
                      <select
                        name="subject"
                        value={filters.subject}
                        onChange={handleFilterChange}
                        className="w-full p-3  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects
                          .filter(
                            (s) =>
                              (!filters.branch || s.branch === filters.branch) &&
                              (!filters.regulation || s.regulation === filters.regulation) &&
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
                      <label className="block text-sm font-medium text-gray-800 mb-2">Unit</label>
                      <select
                        name="unit"
                        value={filters.unit}
                        onChange={handleFilterChange}
                        className="w-full p-3  border border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                </div>
              )}
            </div>
            
            {/* Question Configuration */}
            <div className="space-y-4">
              {/* Short Answer Questions */}
              <div className="bg-white border bottom-1 rounded-lg overflow-hidden">
                <button 
                  type="button"
                  className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-750"
                  onClick={() => setShortAnswerOpen(!shortAnswerOpen)}
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-400" />
                    <span className="font-medium text-gray-900">Short Answer Questions</span>
                  </div>
                  {shortAnswerOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-900" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-900" />
                  )}
                </button>
                
                {shortAnswerOpen && (
                    <div className="p-4 bg-gray-850">
                    {renderQuestionConfig("short")}
                  </div>
                )}
              </div>
              
              {/* Long Answer Questions */}
              <div className="bg-white border bottom-1 rounded-lg overflow-hidden">
                <button 
                  type="button"
                  className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-750"
                  onClick={() => setLongAnswerOpen(!longAnswerOpen)}
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    <span className="font-medium text-gray-900">Long Answer Questions</span>
                  </div>
                  {longAnswerOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-900" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-900" />
                  )}
                </button>
                
                {longAnswerOpen && (
                  <div className="p-4 bg-gray-850">
                    {renderQuestionConfig("long")}
                  </div>
                )}
              </div>
            </div>
            
            {/* Help section */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start">
                <HelpCircle className="w-5 h-5 text-teal-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-gray-900">
                  <p>Configure the distribution of questions in your paper. You can specify:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Total number of questions or unit-wise distribution</li>
                    <li>Bloom's Taxonomy levels for more precise selection</li>
                    <li>Different configurations for short and long answer questions</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg flex items-start">
                <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm whitespace-pre-line">{error}</div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg text-gray-900 font-medium transition-all ${
                loading
                  ? ' cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="mr-3 h-5 w-5 animate-spin" />
                  Generating Question Paper...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Generate Question Paper
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeneratePaper;