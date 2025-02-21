import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen ">
            <Navbar />

            <main className="container mx-auto pt-40">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6">
                        Question Paper Generator
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                        Create professional exam papers in minutes. Upload your question bank
                        and let our system generate a well-structured paper for you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <Link to="/upload" className="group">
                            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="mb-4 text-4xl">📤</div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                                    Upload Questions
                                </h2>
                                <p className="text-gray-600">
                                    Import your question bank in supported formats
                                </p>
                            </div>
                        </Link>

                        <Link to="/generate" className="group">
                            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="mb-4 text-4xl">📝</div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                                    Generate Paper
                                </h2>
                                <p className="text-gray-600">
                                    Create a structured exam paper instantly
                                </p>
                            </div>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Home;