import React, { useState, useContext } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'react-hot-toast';
import { Save, Download, Edit2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import PaperPDF from './PaperPDF';

const DisplayPaper = ({ questions }) => {
  if (!questions || !questions.metadata) return null;

  const { savePaper } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('90 Min');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [saving, setSaving] = useState(false);
  const [examName, setExamName] = useState(questions.metadata.examType || '');
  const [markWeightage, setMarkWeightage] = useState({
    shortAnswer: '10 * 1 = 10M',
    longAnswer: '5 * 10 = 50M'
  });
  const [totalMarks, setTotalMarks] = useState('60M');
  const [shortAnswersHeading, setShortAnswersHeading] = useState('Part A - Short Answer Questions');
  const [longAnswersHeading, setLongAnswersHeading] = useState('Part B - Long Answer Questions');

  const hasShortAnswers = questions.shortAnswers && questions.shortAnswers.length > 0;
  const hasLongAnswers = questions.longAnswers && questions.longAnswers.length > 0;

  const handleSave = async () => {
    if (!title) {
      toast.error('Please enter a title for the paper');
      return;
    }

    setSaving(true);
    try {
      await savePaper(title, {
        ...questions,
        metadata: {
          ...questions.metadata,
          examType: examName,
          markWeightage,
          totalMarks,
          time,
          date,
          shortAnswersHeading,
          longAnswersHeading
        }
      });
      toast.success('Paper saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save paper');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Edit2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Paper Configuration</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Examination Name
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g., Mid Term Examination"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Paper Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="Enter paper title"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g., 90 Min"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder={new Date().toLocaleDateString()}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Total Marks
                </label>
                <input
                  type="text"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g., 60M"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Short Answer Weightage
                </label>
                <input
                  type="text"
                  value={markWeightage.shortAnswer}
                  onChange={(e) => setMarkWeightage({ ...markWeightage, shortAnswer: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g., 10 * 1 = 10M"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Long Answer Weightage
                </label>
                <input
                  type="text"
                  value={markWeightage.longAnswer}
                  onChange={(e) => setMarkWeightage({ ...markWeightage, longAnswer: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g., 5 * 8 = 40M"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Short Answers Section Heading
                </label>
                <input
                  type="text"
                  value={shortAnswersHeading}
                  onChange={(e) => setShortAnswersHeading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g., Part A - Short Answer Questions"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Long Answers Section Heading
                </label>
                <input
                  type="text"
                  value={longAnswersHeading}
                  onChange={(e) => setLongAnswersHeading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g., Part B - Long Answer Questions"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Paper Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold tracking-wide text-gray-900">
                GURU NANAK INSTITUTION OF TECHNOLOGY
              </h1>
              <p className="text-gray-600">
                (An UGC Autonomous Institution – Affiliated to JNTUH)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 text-sm text-gray-600">
                <span>B.Tech {questions.metadata.year} Year</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span>{questions.metadata.semester} Semester</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span>{examName}</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700"><strong>Time:</strong> {time}</span>
                <span className="text-gray-700"><strong>Max Marks:</strong> {totalMarks}</span>
              </div>
              <div className="flex flex-wrap gap-6 text-gray-700">
                <span><strong>Subject:</strong> {questions.metadata.subject}</span>
                <span><strong>Branch:</strong> {questions.metadata.branch}</span>
                {/* <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span> */}
                <span><strong>Date:</strong> {date}</span>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {/* Short Answers */}
              {hasShortAnswers && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{shortAnswersHeading}</h2>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {markWeightage.shortAnswer}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Q.No</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Question</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">Unit</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">BT Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.shortAnswers.map((q, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-700">{q.number}</td>
                            <td className="px-4 py-3 text-gray-700">{q.question}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{q.unit}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{q.btLevel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Long Answers */}
              {hasLongAnswers && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{longAnswersHeading}</h2>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      {markWeightage.longAnswer}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Q.No</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Question</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">Unit</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">BT Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.longAnswers.map((q, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-700">{q.number}</td>
                            <td className="px-4 py-3 text-gray-700">{q.question}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{q.unit}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{q.btLevel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Paper'}
              </button>

              <PDFDownloadLink
                document={
                  <PaperPDF
                    questions={{
                      ...questions,
                      metadata: {
                        ...questions.metadata,
                        examType: examName,
                        markWeightage,
                        totalMarks,
                        time: time, // Explicitly pass the time
                        date,
                        shortAnswersHeading,
                        longAnswersHeading
                      }
                    }}
                  />
                }
                fileName={`${questions.metadata.subject}_${new Date().toISOString().split('T')[0]}.pdf`}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                {({ loading }) => (
                  <>
                    <Download className="w-4 h-4" />
                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPaper;