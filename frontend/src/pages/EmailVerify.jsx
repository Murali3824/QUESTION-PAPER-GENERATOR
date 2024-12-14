import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';


const EmailVerify = () => {
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);  // New state to track OTP sending
    const navigate = useNavigate();
    const { backendUrl,getUserData,setIsLoggedin} = useContext(AppContext);
   


    // Send OTP to the user's email
    const handleSendOtp = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, { userId: 'user-id-here' });


            if (data.success) {
                toast.success("OTP sent to your email.");
                setOtpSent(true);  // Update the state to show "Verify OTP" button
            } else {
                toast.error(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    // Verify the OTP entered by the user
    const handleOtpSubmit = async (e) => {
        e.preventDefault();


        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });


            if (data.success) {
                toast.success("Email verified successfully.");
                setIsLoggedin(true)
                getUserData()
                navigate('/');  // Redirect to home page
            } else {
                toast.error(data.message || "Invalid OTP.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8 pt-24">
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
                            className="group relative w-full py-3 bg-emerald-500 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                        >
                            <span className="flex items-center font-semibold justify-center w-full h-full text-white ">
                                Send OTP
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
                                    className="w-full pl-4 pr-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    required
                                />
                            </div>


                            <button
                                type="submit"
                                className="group relative w-full py-3 bg-emerald-500 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                            >
                                <span className="flex items-center font-semibold justify-center w-full h-full text-white ">
                                    Verify OTP
                                </span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


export default EmailVerify;





