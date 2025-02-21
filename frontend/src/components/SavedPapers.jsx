import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Loader2, FileText, Download, Trash2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaperPDF from './PaperPDF';
import { toast } from 'react-toastify';
import Navbar from './Navbar';

const SavedPapers = () => {
    const { getSavedPapers, deleteSavedPaper } = useContext(AppContext);
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDelete = async (paperId) => {
        if (isDeleting) return;

        try {
            setIsDeleting(true);
            await deleteSavedPaper(paperId);
            toast.success('Paper deleted successfully');
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
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Error loading papers: {error}
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen'>
            <Navbar/>
            <div className=" max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-32">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Saved Papers</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your generated question papers</p>
                    </div>
                </div>

                {papers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                        <div className="text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No papers saved yet</h3>
                            <p className="mt-2 text-sm text-gray-500">Generate and save a paper to see it here.</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paper Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {papers.map((paper) => (
                                        <tr key={paper._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{paper.title}</div>
                                                <div className="text-sm text-gray-500">{paper.metadata.examType}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{paper.metadata.subject}</div>
                                                <div className="text-sm text-gray-500">
                                                    {paper.metadata.branch} • {paper.metadata.semester} Semester
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(paper.generatedDate)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Short: {paper.shortAnswers?.length || 0}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Long: {paper.longAnswers?.length || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <PDFDownloadLink
                                                        document={<PaperPDF questions={paper} />}
                                                        fileName={`${paper.metadata.subject}_${formatDate(paper.generatedDate)}.pdf`}
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </PDFDownloadLink>
                                                    <button
                                                        onClick={() => handleDelete(paper._id)}
                                                        disabled={isDeleting}
                                                        className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default SavedPapers;