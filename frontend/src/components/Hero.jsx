import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ scrollToSection }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <section id="home" className="relative bg-white pt-12 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 lg:flex items-center">
                <div className="lg:w-1/2 mb-12 lg:mb-0">
                    <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                        {t('heroBadge', 'Trusted Cardiology Experts')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                        {t('heroTitle', 'Professional Heart Care')} <br />
                        <span className="text-red-600">{t('heroTitleSuffix', 'In the Palm of Your Hand.')}</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-lg">
                        {t('heroDesc', 'Specialized consultancy for hypertension, heart failure, and lifestyle prevention.')}
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition cursor-pointer shadow-xl shadow-gray-200"
                        >
                            {t('btnLoginHero', 'Patient & Doctor Login')}
                        </button>
                        <div className="flex items-center space-x-2 px-4 py-4">
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/100?u=1" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                                <img src="https://i.pravatar.cc/100?u=2" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                                <img src="https://i.pravatar.cc/100?u=3" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500">{t('heroStats', '500+ Patients Helped')}</span>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 relative">
                    <img
                        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                        alt="Doctor Consultation"
                        className="rounded-3xl shadow-2xl relative z-10"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">{t('responseTitle', 'Response Time')}</p>
                            <p className="text-lg font-bold">{t('responseTime', 'Under 30 Mins')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
