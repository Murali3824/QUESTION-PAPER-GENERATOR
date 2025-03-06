import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
import { Upload, FileText, ExternalLink } from 'lucide-react';

const Home = () => {

    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
            <Navbar />
            <main className="relative w-full px-4 py-12 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-60 -right-60 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-40 right-20 w-60 h-60 bg-teal-600/10 rounded-full blur-3xl"></div>
                </div>

                {/* Main content container */}
                <div className="relative max-w-7xl mx-auto pt-20">
                    <div className="text-center space-y-6 mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                                Question Paper
                            </span>
                            <br />
                            <span className="text-white">Generator</span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Create professional exam papers in minutes. Upload your question bank
                            and let our system generate a well-structured paper for you.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Link to="/upload" className="group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-xl group-hover:border-indigo-500/50 transition-all duration-300">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">Upload Questions</h3>
                                    </div>
                                    <p className="text-slate-400">
                                        Import your question bank in multiple formats. Our system supports various file types to make your experience seamless.
                                    </p>
                                    <div className="mt-6 flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                        <span>Get started</span>
                                        <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/generate" className="group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-xl group-hover:border-teal-500/50 transition-all duration-300">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">Generate Paper</h3>
                                    </div>
                                    <p className="text-slate-400">
                                        Create a structured exam paper instantly. Customize difficulty levels, question types, and formatting options.
                                    </p>
                                    <div className="mt-6 flex items-center text-teal-400 group-hover:text-teal-300 transition-colors">
                                        <span>Create now</span>
                                        <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                </div>
            </main>
            <div className="border-t border-slate-700 mt-8 py-6 flex flex-col md:flex-row justify-center items-center">
                <p className="text-slate-400 text-sm">
                    © {currentYear} ResearchAI. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Home;