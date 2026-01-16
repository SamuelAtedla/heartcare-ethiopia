import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Mail, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            setMessage(response.data.message || t('resetLinkSent'));

            // For development: Show the link if it's returned by the backend
            if (response.data.resetURL) {
                console.log('Reset Link (Dev Only):', response.data.resetURL);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            {t('forgotPassTitle')}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {t('forgotPassSubTitle')}
                        </p>
                    </div>

                    {message && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                            <p className="text-green-700 text-sm">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div className="relative">
                                <label className="text-xs font-semibold text-gray-500 uppercase">{t('labelEmail')}</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                    <Mail size={20} className="text-gray-400 mr-2" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full outline-none text-gray-700"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                {loading ? t('sending') : t('btnSendReset')}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/login" className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-red-600">
                                <ArrowLeft size={16} className="mr-1" />
                                {t('backToLogin')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
