import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Trash, FileText, Calendar, MessageCircle, Plus, Loader2 } from "lucide-react";
import Navbar from './Navbar';

const UploadedFiles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { backendUrl } = useContext(AppContext);

    useEffect(() => {
        fetchFiles();
    }, [backendUrl]);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/upload/files`, {
                withCredentials: true
            });

            if (response.data.success) {
                setFiles(response.data.files);
            }
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch files');
            setLoading(false);
            toast.error('Failed to load files');
        }
    };

    const handleDeleteConfirm = (fileId) => {
        setDeleteConfirm(fileId);
    };

    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleDeleteFile = async (fileId) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/upload/deletefiles/${fileId}`, {
                withCredentials: true
            });

            if (response.data.success) {
                setFiles(files.filter(file => file._id !== fileId));
                toast.success('File deleted successfully');
            }
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(err.response?.data?.error || 'Failed to delete file');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading files...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-32">
                    <div className="bg-red-100 p-4 rounded-lg text-red-700">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-32">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-6 text-white rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Uploaded Files</h1>
                    <Link
                        to="/upload"
                        className="inline-flex items-center border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded transition-colors text-sm sm:text-base"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Upload New File
                    </Link>
                </div>

                {files.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mb-4">No files uploaded yet.</p>
                        <Link 
                            to="/upload" 
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload your first file
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Desktop view - Table */}
                        <div className="hidden md:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Filename</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Uploaded On</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Questions</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {files.map((file, index) => (
                                        <tr key={file._id || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {file.filename || 'Unnamed file'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(file.uploadDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {file.questions?.length || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {deleteConfirm === file._id ? (
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleDeleteFile(file._id)}
                                                            className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
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
                                                    <button
                                                        onClick={() => handleDeleteConfirm(file._id)}
                                                        className="inline-flex items-center text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile view - Cards */}
                        <div className="md:hidden">
                            <ul className="divide-y divide-gray-200">
                                {files.map((file, index) => (
                                    <li key={file._id || index} className="p-4">
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center">
                                                <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-full flex-1">
                                                    {file.filename || 'Unnamed file'}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap text-xs text-gray-500 gap-x-4 gap-y-2">
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(file.uploadDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageCircle className="w-3 h-3 mr-1" />
                                                    {file.questions?.length || 0} questions
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end">
                                                {deleteConfirm === file._id ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleDeleteFile(file._id)}
                                                            className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
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
                                                    <button
                                                        onClick={() => handleDeleteConfirm(file._id)}
                                                        className="inline-flex items-center text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        <Trash className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
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

export default UploadedFiles;