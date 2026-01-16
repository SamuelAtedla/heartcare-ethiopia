import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Lock, Phone, User, Camera, Calendar, FileText, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RegisterPatient = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { loginAction } = useAuth();
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: '',
        fullName: '',
        age: '',
        caseDescription: '',
        role: 'patient'
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('phone', formData.phone);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('fullName', formData.fullName);
            data.append('age', formData.age);
            data.append('caseDescription', formData.caseDescription);
            data.append('role', formData.role);
            if (profilePhoto) {
                data.append('profilePhoto', profilePhoto);
            }

            const response = await apiClient.post('/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            loginAction(response.data.data.user, response.data.token);
            navigate('/patient/dashboard');

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || t('regFailed'));
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
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{t('registerTitle')}</h2>
                        <p className="mt-2 text-sm text-gray-600">{t('registerSubTitle')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
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

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">{t('labelName')}</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                    <User size={20} className="text-gray-400 mr-2" />
                                    <input
                                        name="fullName"
                                        type="text"
                                        required
                                        className="w-full outline-none text-gray-700"
                                        placeholder="Abebe Kebede"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">{t('labelEmail')}</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                    <Mail size={20} className="text-gray-400 mr-2" />
                                    <input
                                        name="email"
                                        type="email"
                                        className="w-full outline-none text-gray-700"
                                        placeholder="abebe@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">{t('labelAge')}</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                                    <Calendar size={20} className="text-gray-400 mr-2" />
                                    <input
                                        name="age"
                                        type="number"
                                        required
                                        className="w-full outline-none text-gray-700"
                                        placeholder="35"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">{t('labelCaseDesc')}</label>
                                <div className="flex items-start border rounded-lg px-3 py-2 mt-1">
                                    <FileText size={20} className="text-gray-400 mr-2 mt-1" />
                                    <textarea
                                        name="caseDescription"
                                        className="w-full outline-none text-gray-700 resize-none h-20"
                                        placeholder={t('placeholderCaseDesc')}
                                        value={formData.caseDescription}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('labelPhoto')}</label>
                                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center group cursor-pointer">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera size={32} className="text-gray-400 group-hover:text-blue-500" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
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
                                {loading ? t('processing') : t('btnCreateAccount')}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                {t('haveAccount')}{' '}
                                <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                                    {t('linkSignIn')}
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegisterPatient;
