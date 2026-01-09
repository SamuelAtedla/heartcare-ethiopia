import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useTranslation } from 'react-i18next';
import { Lock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { loginAction } = useAuth();
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // JSON Request for Login
            const response = await apiClient.post('/auth/login', {
                phone: formData.phone,
                password: formData.password
            });

            loginAction(response.data.data.user, response.data.token);

            if (response.data.data.user.role === 'doctor') {
                navigate('/doctor/dashboard');
            } else {
                navigate('/patient/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || t('authFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {t('loginWelcome')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('loginSubTitle')}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase">{t('labelPhone')}</label>
                            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                <Phone size={20} className="text-gray-400 mr-2" />
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="w-full outline-none text-gray-700"
                                    placeholder="0911..."
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase">{t('labelPassword')}</label>
                            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                <Lock size={20} className="text-gray-400 mr-2" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full outline-none text-gray-700"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
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
                            {loading ? t('processing') : t('btnSignIn')}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            {t('noAccount')}{' '}
                            <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                                {t('linkRegister')}
                            </Link>
                        </p>
                    </div>

                    <div className="text-center mt-2">
                        <Link to="/forgot-password" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
                            {t('linkForgotPass')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
