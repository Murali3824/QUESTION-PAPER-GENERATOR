import React, { useContext } from 'react';
import { Sparkles, ArrowRight, UserCircle } from 'lucide-react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const HeaderRedesign = () => {

        const {userData} = useContext(AppContext)

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center px-4 py-12">
            <div className="max-w-xl mt-20 w-full text-center">
                <div className="relative inline-block mb-6">
                <img 
                    src={assets.header_img} 
                    alt="User Profile" 
                    className=" w-40 h-40 2xl:w-48 2xl:h-48 rounded-full border-4 border-zinc-700 shadow-2xl object-cover"
                />
                <Sparkles 
                    className="absolute top-0 right-0 text-emerald-400 w-12 h-12 -mr-4 -mt-2 animate-pulse" 
                    fill="rgba(16, 185, 129, 0.3)"
                />
                </div>

                <div className="space-y-4 text-white">
                <h1 className="flex items-center justify-center text-2xl font-medium gap-3">
                    <UserCircle className="text-emerald-400 w-8 h-8" />
                    Hey, {userData ? userData.name : "User"}!
                    <span className="text-4xl animate-wave">👋</span>
                </h1>

                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                    Welcome to Our App
                </h2>

                <p className="text-zinc-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                    Discover a world of possibilities with our innovative application. 
                    Seamless design, powerful features, and intuitive experience await you.
                </p>

                <div className="pt-6">
                    <button className="group relative inline-flex items-center justify-center px-10 py-3.5 overflow-hidden font-medium transition duration-300 ease-out border border-emerald-500 rounded-full hover:shadow-2xl hover:border-transparent">
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-emerald-500 group-hover:translate-x-0 ease">
                        <ArrowRight className="w-6 h-6" />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-emerald-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                        Get Started
                    </span>
                    <span className="relative invisible">Get Started</span>
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderRedesign;