import React, { useContext } from 'react';
import { Lock, ArrowRight, UserCircle, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const HeaderRedesign = () => {

    const { userData } = useContext(AppContext)
    return (
        <div className=" w-full max-h-screen  px-6 py-16 md:mt-10 2xl:mt-0  md:px-12 lg:px-16">
            {/* Main content */}
            <div className="relative max-w-5xl 2xl:max-w-7xl mx-auto">
                {/* Profile section with glass effect */}
                <div className="flex items-center justify-between mb-12 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-70"></div>
                            <UserCircle className="relative w-12 h-12 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <p className="text-lg font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Welcome back, {userData?.name || "User"}
                                </p>
                                <span className="text-2xl">✨</span>
                            </div>
                            <p className="text-sm text-gray-400">Your journey continues here</p>
                        </div>
                    </div>
                </div>

                {/* Hero section */}
                <div className="space-y-10">
                    <h1 className="text-5xl md:text-6xl  font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-blue-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                            Secure Your Access
                        </span>
                        <Lock className="inline-block w-10 h-10 ml-3 pb-1 text-blue-400" />
                    </h1>

                    <div className="max-w-2xl space-y-4">
                        <p className="text-xl text-gray-300">
                            Protect your data with our robust and reliable authentication system.
                        </p>
                        <p className="text-xl text-gray-300">
                            Sign up or log in effortlessly and securely to access all features.
                        </p>
                    </div>

                    {/* CTA Buttons with gradients */}
                    <div className="flex gap-6">
                        <button className="group relative inline-flex items-center px-4 sm:px-6 md:px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30">
                            <span className="relative">Get Started</span>
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="group relative inline-flex items-center px-4 sm:px-6 md:px-8 py-4 bg-gray-800 text-gray-300 font-medium rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors">
                            <span className="relative">Learn More</span>
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderRedesign;