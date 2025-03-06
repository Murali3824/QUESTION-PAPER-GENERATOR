import React, { useState, useEffect, useContext } from 'react';
import { Loader2, User, Mail, Shield, Calendar, Check, X, Pencil } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Navbar from './Navbar';
import UpdatePassword from './UpdatePassword';

const Profile = () => {
    const { backendUrl } = useContext(AppContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/auth/profile');
                setUser(response.data.user);
                setNewName(response.data.user.name);
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile data');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateName = async () => {
        if (!newName.trim()) return;

        setUpdateLoading(true);
        try {
            const response = await axios.put(backendUrl + '/api/auth/update-profile', {
                name: newName
            });

            if (response.data.success) {
                setUser(response.data.user);
                setIsEditing(false);
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to update profile name');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="mt-2 text-gray-600">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
                <div className="text-red-400 text-lg font-medium">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        // <div className='grid gap-2 md:grid-cols-2'>
        <div className="min-h-screen bg-white mx-auto ">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-32">
                {updateSuccess && (
                    <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Profile updated successfully
                    </div>
                )}

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/10">
                    {/* Header */}
                    <div className="px-6 py-8 sm:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/10" />
                        <div className="relative flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-10 h-10 text-indigo-600" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="w-full sm:w-auto text-xl font-semibold bg-white/10 text-white rounded-lg px-3 py-2 
                                                         focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
                                                placeholder="Enter new name"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleUpdateName}
                                                    disabled={updateLoading}
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                                                >
                                                    <Check className="w-5 h-5 text-white" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setNewName(user.name);
                                                    }}
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl font-semibold text-white">{user.name}</h1>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-indigo-100 mt-1">Account Profile</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className=" bg-white px-6 py-8 sm:px-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Email */}
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 font-medium">Email Address</p>
                                    <p className="text-black font-medium mt-0.5">{user.email}</p>
                                </div>
                            </div>

                            {/* Account Status */}
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 font-medium">Account Status</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`w-2 h-2 rounded-full ${user.isAccountVerified ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                        <p className="text-black font-medium">
                                            {user.isAccountVerified ? 'Verified Account' : 'Pending Verification'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account ID */}
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl md:col-span-2">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 font-medium">Account ID</p>
                                    <p className="text-black font-medium font-mono mt-0.5 break-all">{user._id}</p>
                                </div>
                            </div>
                            {/* Password Update Section - full width */}
                            <div className="md:col-span-2">
                                <UpdatePassword
                                    backendUrl={backendUrl}
                                    onSuccess={() => {
                                        setUpdateSuccess(true);
                                        setTimeout(() => setUpdateSuccess(false), 3000);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        // </div>
    );
};

export default Profile;