import React, { useState, useEffect } from 'react';
import { doctors } from '../api/mockData';
import { User, Award, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SpecialistGallery = () => {
    const { t } = useTranslation();
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Handle Escape Key to close modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setSelectedDoctor(null);
        };
        if (selectedDoctor) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [selectedDoctor]);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                        {t('galleryBadge', 'Our Team')}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('galleryTitle', 'Meet Our Specialists')}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('galleryDesc', 'World-class cardiologists dedicated to your heart health.')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map((doc) => (
                        <div
                            key={doc.id}
                            onClick={() => setSelectedDoctor(doc)}
                            className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="aspect-square relative overflow-hidden bg-gray-100">
                                <img
                                    src={doc.image}
                                    alt={doc.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <span className="text-white font-bold flex items-center gap-2">
                                        <BookOpen size={18} /> {t('viewProfile', 'View Profile')}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition">{doc.name}</h3>
                                <p className="text-blue-600 font-medium text-sm mb-4">{doc.specialty}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold bg-gray-50 w-fit px-3 py-1 rounded-full">
                                    <Award size={14} />
                                    <span>{t('verifiedSpecialist', 'Verified Specialist')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Doctor Detail Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-8 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image Side - Hidden on small screens if content is long, or fixed height */}
                        <div className="md:w-2/5 md:h-auto h-48 relative shrink-0">
                            <img src={selectedDoctor.image} alt="Detail" className="w-full h-full object-cover" />
                        </div>

                        {/* Content Side - Scrollable */}
                        <div className="md:w-3/5 p-8 md:p-12 relative overflow-y-auto">
                            <button
                                onClick={() => setSelectedDoctor(null)}
                                className="absolute top-6 right-6 p-2 bg-gray-100/80 rounded-full text-gray-400 hover:text-gray-900 transition z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                            </button>

                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedDoctor.name}</h3>
                            <p className="text-blue-600 font-bold mb-6 text-lg">{selectedDoctor.specialty}</p>

                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('about', 'About')}</h4>
                            <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                {selectedDoctor.bio}
                            </p>

                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('credentials', 'Credentials')}</h4>
                            <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
                                <Award className="text-red-500 shrink-0 mt-0.5" size={20} />
                                <p className="text-gray-800 font-medium text-sm">{selectedDoctor.credentials}</p>
                            </div>
                        </div>
                    </div>
                    {/* Backdrop click to close */}
                    <div className="absolute inset-0 -z-10" onClick={() => setSelectedDoctor(null)}></div>
                </div>
            )}
        </section>
    );
};

export default SpecialistGallery;
