import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, User, BookOpen } from 'lucide-react';
import apiClient, { getFileUrl } from '../api/axiosConfig';

const HeroWithCarousel = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [patientsHelped, setPatientsHelped] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await apiClient.get('/public/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/public/stats');
                setPatientsHelped(response.data.patientsHelped);
            } catch (error) {
                console.error('Failed to fetch public stats:', error);
            }
        };

        fetchDoctors();
        fetchStats();
    }, []);

    useEffect(() => {
        if (!isPaused && doctors.length > 1 && !selectedDoctor) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isPaused, doctors.length, currentIndex, selectedDoctor]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % doctors.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex items-center justify-center bg-white">
                <div className="animate-pulse text-gray-400 font-medium">Loading Heart Care Experts...</div>
            </div>
        );
    }

    const currentDoc = doctors[currentIndex];

    return (
        <section id="home" className="relative bg-white pt-12 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 lg:flex items-center gap-12">
                {/* Left Side: Content */}
                <div className="lg:w-1/2 mb-12 lg:mb-0">
                    <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                        {t('heroBadge', 'Trusted Cardiology Experts')}
                    </span>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                        {t('heroTitle', 'Professional Heart Care')} <br />
                        <span className="text-red-600">{t('heroTitleSuffix', 'In the Palm of Your Hand.')}</span>
                    </h1>

                    <p className="text-lg text-gray-700 font-medium mb-8 max-w-lg">
                        {t('heroDesc', 'Specialized consultancy for hypertension, heart failure, and lifestyle prevention.')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition cursor-pointer shadow-xl shadow-gray-200"
                        >
                            {t('btnLoginHero', 'Patient & Doctor Login')}
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="flex -space-x-3">
                                <img src="https://i.pravatar.cc/100?u=1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                                <img src="https://i.pravatar.cc/100?u=2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                                <img src="https://i.pravatar.cc/100?u=3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">
                                    {patientsHelped !== null ? t('heroStatsDynamic', { count: patientsHelped }) : t('heroStats')}
                                </span>
                                <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    {t('responseTime', 'Under 30 Mins')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Doctor Carousel */}
                <div
                    className="lg:w-1/2 relative group"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {doctors.length > 0 && (
                        <div className="relative">
                            {/* Doctor Image */}
                            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100">
                                <img
                                    src={currentDoc.profileImage ? getFileUrl(currentDoc.profileImage) : '/doctor-default.png'}
                                    alt={currentDoc.fullName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => { e.target.src = '/doctor-default.png'; }}
                                />

                                {/* Overlay Content */}
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                                    <h3 className="text-2xl font-bold mb-1">{currentDoc.fullName}</h3>
                                    <p className="text-red-400 font-semibold mb-6 flex items-center gap-2">
                                        <Award size={18} />
                                        {currentDoc.specialty}
                                    </p>

                                    <button
                                        onClick={() => setSelectedDoctor(currentDoc)}
                                        className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center gap-2 group/btn"
                                    >
                                        <BookOpen size={20} className="group-hover/btn:scale-110 transition-transform" />
                                        {t('viewProfile', 'View Profile')}
                                    </button>
                                </div>
                            </div>

                            {/* Carousel Controls */}
                            {doctors.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-800 hover:bg-gray-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-800 hover:bg-gray-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Dots */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                                        {doctors.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Doctor Detail Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-8 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="md:w-2/5 md:h-auto h-48 relative shrink-0">
                            <img
                                src={selectedDoctor.profileImage ? getFileUrl(selectedDoctor.profileImage) : '/doctor-default.png'}
                                alt="Detail"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/doctor-default.png'; }}
                            />
                        </div>

                        <div className="md:w-3/5 p-8 md:p-12 relative overflow-y-auto">
                            <button
                                onClick={() => setSelectedDoctor(null)}
                                className="absolute top-6 right-6 p-2 bg-gray-100/80 rounded-full text-gray-400 hover:text-gray-900 transition z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                            </button>

                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedDoctor.fullName}</h3>
                            <p className="text-blue-600 font-bold mb-6 text-lg">{selectedDoctor.specialty}</p>

                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('about', 'About')}</h4>
                            <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                {selectedDoctor.bio || t('noBio', 'No biography available.')}
                            </p>

                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('credentials', 'Credentials')}</h4>
                            <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
                                <Award className="text-red-500 shrink-0 mt-0.5" size={20} />
                                <p className="text-gray-800 font-medium text-sm">{selectedDoctor.credentials || t('noCredentials', 'No credentials info available.')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10" onClick={() => setSelectedDoctor(null)}></div>
                </div>
            )}
        </section>
    );
};

export default HeroWithCarousel;
