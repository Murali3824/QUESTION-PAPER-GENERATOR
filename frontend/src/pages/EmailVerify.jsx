import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const EmailVerify = () => {
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false); // State to track loading status
    const navigate = useNavigate();
    const { backendUrl, userData, getUserData, isLoggedin, setIsLoggedin } = useContext(AppContext);

    // Send OTP to the user's email
    const handleSendOtp = async () => {
        setLoading(true); // Set loading to true when the request starts
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, { userId: 'user-id-here' });

            if (data.success) {
                toast.success("OTP sent to your email.");
                setOtpSent(true);
            } else {
                toast.error(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false); // Set loading to false when the request completes
        }
    };

    // Verify the OTP entered by the user
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the request starts

        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

            if (data.success) {
                toast.success("Email verified successfully.");
                setIsLoggedin(true);
                getUserData();
                navigate('/'); // Redirect to home page
            } else {
                toast.error(data.message || "Invalid OTP.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false); // Set loading to false when the request completes
        }
    };

    // Redirect if user is logged in and email is already verified
    useEffect(() => {
        if (isLoggedin && userData && userData.isAccountVerified) {
            navigate('/');
        }
    }, [isLoggedin, userData, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
            {/* Logo */}
            <div onClick={() => navigate('/')} className="cursor-pointer absolute left-4 md:left-14 lg:left-24 top-6 flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-full animate-pulse">
                    <ShieldCheck className="text-indigo-400 w-10 h-10" />
                </div>
                <span className="text-white text-3xl font-semibold tracking-wider">
                    AUTHFLOW
                </span>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800">
                <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8 pt-16">
                        <h2 className="text-3xl font-bold text-white text-center mb-4">Verify Your Email</h2>
                        <p className="text-zinc-400 text-center mb-8">
                            {otpSent
                                ? 'Enter the OTP sent to your email address to verify your account.'
                                : 'Click the button below to receive an OTP for email verification.'}
                        </p>

                        {/* Conditionally render the OTP form based on whether OTP has been sent */}
                        {!otpSent ? (
                            <button
                                onClick={handleSendOtp}
                                className="group relative w-full py-3 bg-indigo-400 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                                disabled={loading} // Disable the button while loading
                            >
                                <span className="flex items-center font-semibold justify-center w-full h-full text-white ">

                                    {loading ? (
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />

                                    ) : (
                                            "Send OTP"
                                    )}
                                </span>

                            </button>
                        ) : (
                            <form onSubmit={handleOtpSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-4 pr-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="group relative w-full py-3 bg-indigo-400 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                                    disabled={loading} // Disable the button while loading
                                >
                                    <span className="flex items-center font-semibold justify-center w-full h-full text-white ">

                                        {loading ? (
                                            <Loader2 className="animate-spin w-5 h-5 mr-2" />

                                        ) : (
                                            "Verify OTP"
                                        )}
                                    </span>
                                    
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerify;
