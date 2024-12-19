import React, { useContext, useEffect } from 'react';
import { Loader } from 'lucide-react'; // Importing the Loader icon from lucide-react
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import bgImg from '../assets/bg.jpg'

const Verifyinfo = () => {

    const navigate = useNavigate();
    const {userData } = useContext(AppContext);

    useEffect(() => {
            if (userData) {
                navigate('/');
            }
        }, [userData, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-center"style={{backgroundImage:`url(${bgImg})`}}>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">You're Almost There!</h1>
                <p className="text-lg text-gray-600 mb-6">
                    You are just one step away from verifying your account. Please confirm your email address to get started.
                </p>
                <div className="flex justify-center mb-6">
                    {/* Using the Loader icon from lucide-react */}
                    <Loader className="w-16 h-16 text-blue-500 animate-spin" />
                </div>
                <p className="text-lg text-gray-600 mb-4">
                    We've sent a verification link to your email. Please check your inbox and follow the instructions to verify your email address.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    If you didn't receive the email, check your spam folder 
                    {/* <span> or try clicking the button below to resend the verification link.</span> */}
                </p>
                {/* <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg hover:bg-blue-700 transition duration-300"
                >
                    Resend Verification Email
                </button>
                <p className="text-sm text-gray-500 mt-4">
                    If you did not register for an account with us, please ignore this email.
                </p> */}
                <p className="text-sm text-gray-500 mt-2">
                    Need help? Feel free to reach out to our support team at <a href="mailto:teamSupport@gmail.com" className="text-blue-600">teamSupport@gmail.com</a>
                </p>
            </div>
        </div>
    );
};

export default Verifyinfo;