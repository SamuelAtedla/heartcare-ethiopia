import React, { useState } from 'react';
import { Lock, ShieldCheck, Loader2, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/axiosConfig';
import { useNotification } from '../context/NotificationContext';

const PasswordManager = ({ isDoctor = false }) => {
    const { t } = useTranslation();
    const { notify } = useNotification();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const toggleVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validate = () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            notify.error(t('allFieldsRequired') || 'All fields are required');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            notify.error(t('passMismatch') || 'Passwords do not match');
            return false;
        }
        if (formData.newPassword.length < 6) {
            notify.error(t('passwordTooShort') || 'Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setSuccess(false);
        try {
            await apiClient.put('/auth/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            setSuccess(true);
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            notify.success(t('passwordChangedSuccess') || 'Password updated successfully!');
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Password change failed:', error);
            const errorMsg = error.response?.data?.error || 'Failed to update password';
            notify.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = `w-full pl-12 pr-12 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 transition-all font-medium ${isDoctor ? 'ring-red-100 focus:ring-red-500/20' : 'ring-red-100'}`;
    const iconColor = isDoctor ? 'text-gray-400 group-focus-within:text-red-500' : 'text-gray-400 group-focus-within:text-red-600';
    const buttonClasses = `w-full ${isDoctor ? 'bg-gray-900 hover:bg-black' : 'bg-red-600 hover:bg-red-700'} text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2`;

    return (
        <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDoctor ? 'bg-gray-900 text-white' : 'bg-red-50 text-red-600'}`}>
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h3 className="font-black text-xl text-gray-900">{t('changePassword') || 'Change Password'}</h3>
                    <p className="text-sm text-gray-500 font-medium">{t('securityUpdateDesc') || 'Keep your account secure with a strong password.'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('currentPassword') || 'Current Password'}</label>
                        <div className="relative group">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${iconColor}`} size={18} />
                            <input
                                type={showPassword.current ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                className={inputClasses}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => toggleVisibility('current')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('newPassword') || 'New Password'}</label>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${iconColor}`} size={18} />
                                <input
                                    type={showPassword.new ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className={inputClasses}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('new')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('confirmNewPassword') || 'Confirm New Password'}</label>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${iconColor}`} size={18} />
                                <input
                                    type={showPassword.confirm ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={inputClasses}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('confirm')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={buttonClasses}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {t('updatePassword') || 'Update Password'}
                    </button>
                    {success && (
                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in slide-in-from-left-2 whitespace-nowrap">
                            <CheckCircle2 size={18} />
                            {t('saved') || 'Saved!'}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PasswordManager;
