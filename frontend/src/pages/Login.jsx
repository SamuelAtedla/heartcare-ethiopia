import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Heart, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const { t } = useTranslation();
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isNewUser, setIsNewUser] = useState(false);
    const [step, setStep] = useState('phone'); // phone, auth
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        password: '',
    });

    const checkUserExists = async () => {
        setLoading(true);
        // Simulate API check
        setTimeout(() => {
            setLoading(false);
            // Mock Logic: If phone ends in 0, treat as new user
            if (formData.phone.endsWith('0')) {
                setIsNewUser(true);
            } else {
                setIsNewUser(false);
            }
            setStep('auth');
        }, 800);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let user;
            if (isNewUser) {
                user = await register(formData);
            } else {
                user = await login(formData.phone, formData.password);
            }

            // Redirect based on role
            const origin = location.state?.from?.pathname;
            if (origin) {
                navigate(origin);
            } else {
                navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
            }
        } catch (err) {
            alert('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-600 p-3 rounded-full">
                        <Heart className="text-white w-8 h-8" fill="currentColor" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    {step === 'phone' ? 'Welcome Back' : (isNewUser ? 'Create Account' : 'Welcome Back')}
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    {step === 'phone' ? 'Enter your phone number to continue' : (isNewUser ? 'Complete your registration' : 'Enter your credentials')}
                </p>

                <form onSubmit={step === 'phone' ? (e) => { e.preventDefault(); checkUserExists(); } : handleSubmit} className="space-y-4">

                    {/* Step 1: Phone */}
                    <div className={step === 'phone' ? 'block' : 'hidden'}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            required
                            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="09xxxxxxxx"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={18} /></>}
                        </button>
                    </div>

                    {/* Step 2: Auth (Password/Name) */}
                    {step === 'auth' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-4">
                                <span className="font-medium text-gray-700">{formData.phone}</span>
                                <button type="button" onClick={() => setStep('phone')} className="text-sm text-red-600 font-bold">Change</button>
                            </div>

                            {isNewUser && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold mt-6 flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : (isNewUser ? 'Register & Login' : 'Login')}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
