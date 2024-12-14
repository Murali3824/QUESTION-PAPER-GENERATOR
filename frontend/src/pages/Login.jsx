import React, { useContext, useState } from 'react';
import { Lock, Mail, User, ShieldCheck , Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

    const [state, setState] = useState('Sign Up');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate()

    const {backendUrl,setIsLoggedin, getUserData} = useContext(AppContext)

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onsubmitHandler = async (e) => {
        e.preventDefault();
    
        try {
            axios.defaults.withCredentials = true;
    
            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });
                if (data.success) {
                    toast.success("Registration successful");
                    setIsLoggedin(true);
                    getUserData()
                    navigate('/');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });
                if (data.success) {
                    toast.success("Login successful");
                    setIsLoggedin(true);
                    getUserData()
                    navigate('/');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-36 h-20 bg-zinc-700 rounded-b-full flex items-center justify-center ">
                    <div className="bg-emerald-500/20 p-2 rounded-full animate-pulse" >
                        <ShieldCheck className="text-emerald-400 w-10 h-10" />
                    </div>
                </div>

                <div className="p-8 pt-24">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">
                        {state === 'Sign Up' ? 'Create Your Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-zinc-400 text-center mb-8">
                        {state === 'Sign Up' ? 'Join us and start your journey!' : 'Please log in to continue'}
                    </p>

                    <form onSubmit={onsubmitHandler} className="space-y-4">
                        {state === 'Sign Up' && (
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                                <input
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                            <input
                                onChange={e=>setEmail(e.target.value)}
                                value={email}
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                            <input
                                onChange={e=>setPassword(e.target.value)}
                                value={password}
                                type="password"
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                required
                            />
                        </div>

                        {state === 'Login' && (
                            <div className="flex items-center justify-between">
                                <label 
                                    className="flex items-center text-zinc-400 text-sm cursor-pointer"
                                    onClick={() => setRememberMe(!rememberMe)}
                                >
                                    <div className={`mr-2 w-5 h-5 border rounded flex items-center justify-center 
                                        ${rememberMe ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                                        {rememberMe && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    Remember me
                                </label>
                                <span onClick={()=>navigate('/reset-password')} className="text-sm text-emerald-400 hover:underline cursor-pointer">
                                    Forgot password?
                                </span>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="group relative w-full py-3 bg-emerald-500 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                        >
                            <span className="flex items-center font-semibold justify-center w-full h-full text-white ">
                                {state}
                            </span>
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        {state === 'Sign Up' ? (
                            <p className="text-zinc-400 text-sm">
                                Already have an account?{' '}
                                <button 
                                    onClick={() => setState('Login')} 
                                    className="text-emerald-400 hover:underline"
                                >
                                    Login
                                </button>
                            </p>
                        ) : (
                            <p className="text-zinc-400 text-sm">
                                Don't have an account?{' '}
                                <button 
                                    onClick={() => setState('Sign Up')} 
                                    className="text-emerald-400 hover:underline"
                                >
                                    Sign Up
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
