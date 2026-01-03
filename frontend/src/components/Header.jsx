import React from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ scrollToSection }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleHomeClick = () => {
        if (location.pathname === '/' && scrollToSection) {
            scrollToSection('home');
        } else {
            navigate('/');
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={handleHomeClick}
                >
                    <img src="/logo.png" alt="Heart Care Ethiopia Logo" className="h-12 w-auto" />
                    <span className="text-xl font-bold tracking-tight text-gray-800 uppercase">
                        HEART CARE <span className="text-red-600">ETHIOPIA</span>
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <nav className="hidden md:flex space-x-6 font-medium mr-4">
                        <button
                            onClick={handleHomeClick}
                            className="hover:text-red-600 transition"
                        >
                            {t('navHome', 'Home')}
                        </button>
                        <button
                            onClick={() => navigate('/services')}
                            className="hover:text-red-600 transition"
                        >
                            {t('navServices', 'Services')}
                        </button>
                    </nav>

                    {/* Language Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 mr-2">
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition ${i18n.language === 'en'
                                ? 'bg-white shadow-sm text-red-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => changeLanguage('am')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition ${i18n.language === 'am'
                                ? 'bg-white shadow-sm text-red-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            አማ
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        className="hidden sm:block bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition shadow-lg shadow-red-200 text-sm cursor-pointer"
                    >
                        {t('btnBook', 'Book Appointment')}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
