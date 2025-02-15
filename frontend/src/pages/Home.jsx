import React from 'react';
import Navbar from '../components/Navbar';
// import Header from '../components/Header';
import { Link } from "react-router-dom";


const Home = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen '>
            <Navbar />
            {/* <Header/> */}
            <div className="p-6 flex flex-col items-center justify-center bg-gray-100">
                <h1 className="text-3xl font-bold mb-6">📄 Question Paper Generator</h1>
                <p className="mb-4 text-lg">Upload a question bank and generate a structured exam paper easily.</p>

                <div className="flex gap-4">
                    <Link to="/upload">
                        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                            📤 Upload Questions
                        </button>
                    </Link>

                    <Link to="/generate">
                        <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                            📝 Generate Paper
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;