import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setMessage('Your password has been reset successfully. You can now login with your new password.');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'The reset link is invalid or has expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                </div>

                {message && (
                    <div className={`border-l-4 p-4 mb-4 ${success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                        <p className={`${success ? 'text-green-700' : 'text-red-700'} text-sm`}>{message}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {!success ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div className="relative">
                                <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                    <Lock size={20} className="text-gray-400 mr-2" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full outline-none text-gray-700"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Confirm Password</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                    <Lock size={20} className="text-gray-400 mr-2" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full outline-none text-gray-700"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-lg hover:shadow-xl`}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center mt-6">
                        <div className="flex justify-center mb-4">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <p className="text-gray-600 mb-6">Redirecting you to login page...</p>
                        <Link to="/login" className="text-red-600 font-medium hover:text-red-500">
                            Click here if not redirected
                        </Link>
                    </div>
                )}

                {!success && (
                    <div className="text-center mt-4">
                        <Link to="/login" className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-red-600">
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
