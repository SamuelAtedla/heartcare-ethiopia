import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Award, User } from 'lucide-react';
import apiClient, { getFileUrl } from '../api/axiosConfig';

const DoctorCarousel = () => {
    const { t } = useTranslation();
    const [doctors, setDoctors] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);

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
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (!isPaused && doctors.length > 1) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isPaused, doctors.length, currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % doctors.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center bg-gray-50 border-b border-gray-100">
                <div className="animate-pulse text-gray-400 font-medium">Loading our specialists...</div>
            </div>
        );
    }

    if (doctors.length === 0) return null;

    const currentDoc = doctors[currentIndex];

    return (
        <section
            className="relative bg-white pt-8 pb-16 border-b border-gray-100 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl relative">
                            <img
                                src={getFileUrl(currentDoc.profileImage) || 'https://via.placeholder.com/800x1000?text=No+Image'}
                                alt={currentDoc.fullName}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x1000?text=No+Image'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 flex justify-between pointer-events-none">
                            <button
                                onClick={prevSlide}
                                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-900 hover:text-white transition pointer-events-auto"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-900 hover:text-white transition pointer-events-auto"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 text-left">
                        <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                            {t('featuredSpecialist', 'Featured Specialist')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                            {currentDoc.fullName}
                        </h1>
                        <p className="text-xl md:text-2xl font-semibold text-blue-600 mb-6">
                            {currentDoc.specialty}
                        </p>

                        <div className="space-y-6 mb-10">
                            <p className="text-lg text-gray-600 leading-relaxed line-clamp-4 italic">
                                "{currentDoc.bio || t('noBioAvailable', 'Dedicated to providing the best heart care services.')}"
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                    <Award size={20} className="text-red-500" />
                                    <span className="text-sm font-bold text-gray-700">{t('highlyQualified', 'Highly Qualified')}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                    <User size={20} className="text-blue-500" />
                                    <span className="text-sm font-bold text-gray-700">{t('patientFocused', 'Patient Focused')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl shadow-gray-200">
                                {t('viewFullProfile', 'View Full Profile')}
                            </button>
                            <div className="flex gap-2">
                                {doctors.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-1/2 -z-10"></div>
        </section>
    );
};

export default DoctorCarousel;
