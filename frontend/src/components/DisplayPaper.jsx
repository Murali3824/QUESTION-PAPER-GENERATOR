import React, { useState, useContext } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'react-hot-toast';
import { AppContext } from '../context/AppContext';
import PaperPDF from './PaperPDF';

const DisplayPaper = ({ questions }) => {
  if (!questions || !questions.metadata) return null;

  const { savePaper } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title) {
      toast.error('Please enter a title for the paper');
      return;
    }

    setSaving(true);
    try {
      await savePaper(title, questions);
      toast.success('Paper saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save paper');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-50 border rounded-lg shadow-lg">
      <div className="text-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-extrabold uppercase">GURU NANAK INSTITUTIONS TECHNOLOGY </h1>
        <p className="text-sm text-gray-600">(An UGC Autonomous Institution – Affiliated to JNTUH)</p>
        <p className="text-sm text-gray-600">B.Tech {questions.metadata.year} Year {questions.metadata.semester} Semester - {questions.metadata.examType}</p>
      </div>
      <div className="mb-6 text-lg font-bold text-gray-800">
        Subject: {questions.metadata.subject} | Branch: {questions.metadata.branch}
      </div>
      <h2 className="text-lg font-semibold mt-4">Part A - Short Answer Questions</h2>
      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border px-4 py-2">S. No</th>
            <th className="border px-4 py-2">Question</th>
            <th className="border px-4 py-2">Unit</th>
            <th className="border px-4 py-2">BT Level</th>
          </tr>
        </thead>
        <tbody>
          {questions.shortAnswers.map((q, index) => (
            <tr key={index} className="text-gray-800 border">
              <td className="border px-4 py-2 text-center">{q.number}</td>
              <td className="border px-4 py-2">{q.question}</td>
              <td className="border px-4 py-2 text-center">{q.unit}</td>
              <td className="border px-4 py-2 text-center">{q.btLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-lg font-semibold mt-6">Part B - Long Answer Questions</h2>
      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border px-4 py-2">S. No</th>
            <th className="border px-4 py-2">Question</th>
            <th className="border px-4 py-2">Unit</th>
            <th className="border px-4 py-2">BT Level</th>
          </tr>
        </thead>
        <tbody>
          {questions.longAnswers.map((q, index) => (
            <tr key={index} className="text-gray-800 border">
              <td className="border px-4 py-2 text-center">{q.number}</td>
              <td className="border px-4 py-2">{q.question}</td>
              <td className="border px-4 py-2 text-center">{q.unit}</td>
              <td className="border px-4 py-2 text-center">{q.btLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Enter paper title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full max-w-xs"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {saving ? 'Saving...' : 'Save Paper'}
        </button>
        <PDFDownloadLink
          document={<PaperPDF questions={questions} />}
          fileName={`${questions.metadata.subject}_${new Date().toISOString().split('T')[0]}.pdf`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default DisplayPaper;
