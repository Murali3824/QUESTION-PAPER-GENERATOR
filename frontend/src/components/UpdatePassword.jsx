import { useState } from 'react';
import { KeyRound, Eye, EyeOff, Check, X, Lock } from 'lucide-react';
import axios from 'axios';

const UpdatePassword = ({ backendUrl, onSuccess }) => {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleTogglePassword = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleUpdatePassword = async () => {
        if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.put(backendUrl + '/api/auth/update-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });

            if (response.data.success) {
                onSuccess?.();
                setIsEditing(false);
                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-slate-400 font-medium">Password</p>
                    <p className="text-white font-medium mt-0.5">••••••••</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    Change
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-medium text-white">Update Password</h3>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Old Password */}
                <div className="relative">
                    <input
                        type={showPasswords.old ? 'text' : 'password'}
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, oldPassword: e.target.value }))}
                        placeholder="Current Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white 
                                 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                        type="button"
                        onClick={() => handleTogglePassword('old')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/75"
                    >
                        {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {/* New Password */}
                <div className="relative">
                    <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white 
                                 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                        type="button"
                        onClick={() => handleTogglePassword('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/75"
                    >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {/* Confirm New Password */}
                <div className="relative">
                    <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white 
                                 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                        type="button"
                        onClick={() => handleTogglePassword('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/75"
                    >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setError('');
                            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdatePassword}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 
                                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;