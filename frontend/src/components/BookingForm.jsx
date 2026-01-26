import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
// import { FaWhatsapp, FaTelegram } from 'react-icons/fa'; // We'll use simple SVGs or lucide icons if possible, or just text for now to match style

import { useNotification } from '../context/NotificationContext';

const BookingForm = () => {
    const { t, i18n } = useTranslation();
    const { notify } = useNotification();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        concern: 'Hypertension',
        platform: 'WhatsApp'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handlePlatformChange = (platform) => {
        setFormData({ ...formData, platform });
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.phone || !formData.date) {
                notify.warning(t('alertFill', 'Please fill in all required fields.'));
                return;
            }
            setStep(2);
        }
    };

    const simulatePayment = (method) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 2000);
    };

    const getConfirmationMessage = () => {
        // In a real app we might use i18n interpolation properly, but for now simple string concat matching original logic
        return `${t('confPrefix', 'Hello ')}${formData.name}${t('confBody', ', your consultancy for ')}${formData.concern} (${formData.date})${t('confSuffix', ' is confirmed...')}`;
    };

    const clinicPhone = "251912345678";
    const clinicTG = "HeartCareEthiopiaBot";
    const message = encodeURIComponent(`Heart Care Ethiopia: ${formData.name}, Concern: ${formData.concern}, Date: ${formData.date}`);
    const waLink = `https://wa.me/${clinicPhone}?text=${message}`;
    const tgLink = `https://t.me/${clinicTG}?text=${message}`;

    return (
        <section id="register-section" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Stepper */}
                    <div className="flex border-b">
                        <div className={`flex-1 text-center py-6 font-bold text-sm uppercase tracking-wider ${step === 1 ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}>{t('step1', '1. Registration')}</div>
                        <div className={`flex-1 text-center py-6 font-bold text-sm uppercase tracking-wider ${step === 2 ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}>{t('step2', '2. Payment')}</div>
                        <div className={`flex-1 text-center py-6 font-bold text-sm uppercase tracking-wider ${step === 3 ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}>{t('step3', '3. Connect')}</div>
                    </div>

                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="p-8 md:p-12">
                            <h2 className="text-2xl font-bold mb-8">{t('formTitle', 'Patient Information')}</h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">{t('labelName', 'Full Name')}</label>
                                        <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none" placeholder={i18n.language === 'am' ? "ስምዎን ያስገቡ" : "Enter your name"} />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">{t('labelPhone', 'Phone Number')}</label>
                                        <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none" placeholder="09xxxxxxxx" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="concern" className="block text-sm font-bold text-gray-700 mb-2">{t('labelConcern', 'Heart Concern / Symptoms')}</label>
                                    <select id="concern" value={formData.concern} onChange={handleChange} className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none">
                                        <option value="Hypertension">{t('opt1', 'Hypertension')}</option>
                                        <option value="Chest Pain">{t('opt2', 'Chest Pain')}</option>
                                        <option value="Irregular Heartbeat">{t('opt3', 'Irregular Heartbeat')}</option>
                                        <option value="Check-up">{t('opt4', 'Preventative Check-up')}</option>
                                        <option value="Second Opinion">{t('opt5', 'Second Opinion')}</option>
                                    </select>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('labelPlatform', 'Preferred Platform')}</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label
                                                onClick={() => handlePlatformChange('WhatsApp')}
                                                className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center space-x-2 transition ${formData.platform === 'WhatsApp' ? 'border-red-600 bg-red-50' : 'border-gray-100'}`}
                                            >
                                                <span className="text-green-500 font-bold">WA</span>
                                                <span>WhatsApp</span>
                                            </label>
                                            <label
                                                onClick={() => handlePlatformChange('Telegram')}
                                                className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center space-x-2 transition ${formData.platform === 'Telegram' ? 'border-red-600 bg-red-50' : 'border-gray-100'}`}
                                            >
                                                <span className="text-blue-500 font-bold">TG</span>
                                                <span>Telegram</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-2">{t('labelDate', 'Appointment Date')}</label>
                                        <input type="date" id="date" value={formData.date} onChange={handleChange} required className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none" />
                                    </div>
                                </div>
                                <button type="button" onClick={nextStep} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition cursor-pointer">
                                    {t('btnProceed', 'Proceed to Payment')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="p-8 md:p-12 text-center">
                            <h2 className="text-2xl font-bold mb-4">{t('payTitle', 'Confirm & Pay')}</h2>
                            <p className="text-gray-500 mb-8 text-lg">
                                <span>{t('payFee', 'Consultancy Fee:')}</span> <span className="font-bold text-gray-900">500 ETB</span>
                            </p>

                            <div className="space-y-4 max-w-sm mx-auto">
                                <button onClick={() => simulatePayment('Telebirr')} disabled={loading} className="w-full bg-blue-500 text-white p-4 rounded-2xl flex items-center justify-between hover:bg-blue-600 transition group cursor-pointer">
                                    <span className="font-bold">Pay with Telebirr</span>
                                    {loading ? <Loader2 className="animate-spin" /> : <span>&rarr;</span>}
                                </button>
                                <button onClick={() => simulatePayment('CBE Birr')} disabled={loading} className="w-full bg-purple-600 text-white p-4 rounded-2xl flex items-center justify-between hover:bg-purple-700 transition group cursor-pointer">
                                    <span className="font-bold">Pay with CBE Birr</span>
                                    {loading ? <Loader2 className="animate-spin" /> : <span>&rarr;</span>}
                                </button>
                            </div>
                            <p className="mt-8 text-sm text-gray-400">
                                {t('paySecure', 'Secure Transaction powered by Chapa/SantimPay')}
                            </p>
                        </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <div className="p-8 md:p-12 text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">{t('confTitle', 'Booking Confirmed!')}</h2>
                            <p className="text-gray-600 mb-8">{getConfirmationMessage()}</p>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
                                <p className="font-bold text-gray-800 mb-4">{t('commNow', 'Start Communication Now:')}</p>
                                <div className="flex flex-col space-y-4">
                                    <a href={waLink} target="_blank" rel="noreferrer" className="bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-green-600 transition">
                                        <span>{t('btnWA', 'Connect via WhatsApp')}</span>
                                    </a>
                                    <a href={tgLink} target="_blank" rel="noreferrer" className="bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-blue-600 transition">
                                        <span>{t('btnTG', 'Connect via Telegram')}</span>
                                    </a>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 italic">{t('confNote', 'Please have reports ready.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BookingForm;
