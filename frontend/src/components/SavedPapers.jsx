import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Loader2, FileText, Download, Trash2, Calendar, BookOpen, GraduationCap, Plus } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaperPDF from './PaperPDF';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const SavedPapers = () => {
    const { getSavedPapers, deleteSavedPaper } = useContext(AppContext);
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchPapers = async () => {
        try {
            const savedPapers = await getSavedPapers();
            setPapers(savedPapers);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPapers();
    }, [getSavedPapers]);

    const handleDeleteConfirm = (paperId) => {
        setDeleteConfirm(paperId);
    };

    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleDelete = async (paperId) => {
        if (isDeleting) return;

        try {
            setIsDeleting(true);
            await deleteSavedPaper(paperId);
            toast.success('Paper deleted successfully');
            setDeleteConfirm(null);
            // Refresh the papers list
            fetchPapers();
        } catch (err) {
            toast.error(err.message || 'Failed to delete paper');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="mt-2 text-gray-600">Loading papers...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-32">
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">
                        Error loading papers: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-32">
                <div className=" bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-6 text-white rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Saved Papers</h1>
                        <p className="mt-1 text-sm">Manage your generated question papers</p>
                    </div>
                    <Link
                        to="/generate"
                        className="inline-flex items-center border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded transition-colors text-sm sm:text-base"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Generate New Paper
                    </Link>
                </div>

                {papers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No papers saved yet</h3>
                        <p className="mt-2 text-sm text-gray-500 mb-6">Generate and save a paper to see it here.</p>
                        <Link
                            to="/generator"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Generate Your First Paper
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Desktop view - Table */}
                        <div className="hidden lg:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Paper Title</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Subject Details</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Questions</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {papers.map((paper) => (
                                            <tr key={paper._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{paper.title}</div>
                                                    <div className="text-xs text-gray-500">{paper.metadata.examType}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-900">{paper.metadata.subject}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {paper.metadata.branch} • {paper.metadata.semester} Semester
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(paper.generatedDate)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            Short: {paper.shortAnswers?.length || 0}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Long: {paper.longAnswers?.length || 0}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    {deleteConfirm === paper._id ? (
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleDelete(paper._id)}
                                                                disabled={isDeleting}
                                                                className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded disabled:opacity-50"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={handleCancelDelete}
                                                                className="text-xs bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end space-x-2">
                                                            <PDFDownloadLink
                                                                document={<PaperPDF questions={paper} />}
                                                                fileName={`${paper.metadata.subject}_${formatDate(paper.generatedDate)}.pdf`}
                                                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </PDFDownloadLink>
                                                            <button
                                                                onClick={() => handleDeleteConfirm(paper._id)}
                                                                className="text-red-600 hover:text-red-800 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tablet view - Simplified table */}
                        <div className="hidden sm:block lg:hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paper</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {papers.map((paper) => (
                                            <tr key={paper._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{paper.title}</div>
                                                    <div className="text-xs text-gray-500">{paper.metadata.subject}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-xs text-gray-500">
                                                            <Calendar className="inline w-3 h-3 mr-1" />
                                                            {formatDate(paper.generatedDate)}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                S: {paper.shortAnswers?.length || 0}
                                                            </span>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                L: {paper.longAnswers?.length || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {deleteConfirm === paper._id ? (
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleDelete(paper._id)}
                                                                disabled={isDeleting}
                                                                className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded disabled:opacity-50"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={handleCancelDelete}
                                                                className="text-xs bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end space-x-2">
                                                            <PDFDownloadLink
                                                                document={<PaperPDF questions={paper} />}
                                                                fileName={`${paper.metadata.subject}_${formatDate(paper.generatedDate)}.pdf`}
                                                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </PDFDownloadLink>
                                                            <button
                                                                onClick={() => handleDeleteConfirm(paper._id)}
                                                                className="text-red-600 hover:text-red-800 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile view - Cards */}
                        <div className="sm:hidden">
                            <ul className="divide-y divide-gray-200">
                                {papers.map((paper) => (
                                    <li key={paper._id} className="p-4">
                                        <div className="flex flex-col space-y-3">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{paper.title}</h3>
                                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                                    <BookOpen className="w-3 h-3 mr-1" />
                                                    {paper.metadata.subject}
                                                </div>
                                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                                    <GraduationCap className="w-3 h-3 mr-1" />
                                                    {paper.metadata.branch} • {paper.metadata.semester} Semester
                                                </div>
                                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(paper.generatedDate)}
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Short: {paper.shortAnswers?.length || 0}
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Long: {paper.longAnswers?.length || 0}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-end pt-2">
                                                {deleteConfirm === paper._id ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleDelete(paper._id)}
                                                            disabled={isDeleting}
                                                            className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded disabled:opacity-50"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={handleCancelDelete}
                                                            className="text-xs bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-3">
                                                        <PDFDownloadLink
                                                            document={<PaperPDF questions={paper} />}
                                                            fileName={`${paper.metadata.subject}_${formatDate(paper.generatedDate)}.pdf`}
                                                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Download className="w-4 h-4 mr-1" />
                                                            <span>Download</span>
                                                        </PDFDownloadLink>
                                                        <button
                                                            onClick={() => handleDeleteConfirm(paper._id)}
                                                            className="inline-flex items-center text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedPapers;