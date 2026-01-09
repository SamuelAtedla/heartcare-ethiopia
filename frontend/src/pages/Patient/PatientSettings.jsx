import React, { useState } from 'react';
import { User, Phone, Calendar, Mail, Save, Loader2, Camera, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient, { getFileUrl } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const PatientSettings = () => {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        email: user?.email || '',
        age: user?.age || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            await apiClient.put('/patient/profile', formData);

            // Sync with global auth state
            updateUser(formData);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('accountSettings')}</h1>
                    <p className="text-gray-500 font-medium">{t('settingsDesc')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm text-center">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full rounded-[40px] bg-red-50 flex items-center justify-center text-red-600 overflow-hidden border-4 border-white shadow-xl">
                                {user?.profileImage ? (
                                    <img src={getFileUrl(user.profileImage)} className="w-full h-full object-cover" alt="" />
                                ) : <User size={48} />}
                            </div>
                            <button className="absolute -right-2 -bottom-2 w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all border-4 border-white shadow-lg">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h3 className="font-black text-xl text-gray-900">{formData.fullName}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{t('patientMember')}</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('labelName')}</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('labelPhone')}</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium"
                                        placeholder="+251..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('labelEmail')}</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('labelAge')}</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium"
                                        placeholder="25"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-red-600 text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {t('btnSaveChanges')}
                            </button>
                            {success && (
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in slide-in-from-left-2">
                                    <CheckCircle2 size={18} />
                                    {t('saved')}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientSettings;
