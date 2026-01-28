import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heart, Activity, Stethoscope, ClipboardCheck, UserCheck, ShieldCheck, ArrowRight, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/axiosConfig';

import { defaultServices } from '../data/defaultServices';

const iconMap = {
    Heart, Activity, Stethoscope, ClipboardCheck, UserCheck, ShieldCheck, Layout
};

const ServicesPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isAm = i18n.language === 'am';
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await apiClient.get('/services');
                if (response.data && response.data.length > 0) {
                    setServices(response.data);
                } else {
                    setServices(defaultServices);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                setServices(defaultServices);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Header Section */}
            <section className="bg-red-600 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{isAm ? "የሚሰጡ ህክምናዎች" : "Our Services"}</h1>
                    <p className="text-xl md:text-2xl text-red-100 max-w-2xl mx-auto font-light">
                        {isAm
                            ? "ሁለንተናዊ የልብ ህክምና አገልግሎት ለእርስዎ። ከቅድመ-መከላከል እስከ ውስብስብ ህክምናዎች፣ ለልብዎ ጤና አለንልዎ።"
                            : "Comprehensive cardiovascular care tailored to your unique needs. From prevention to complex management, we are here for your heart."
                        }
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => {
                                const Icon = iconMap[service.iconName] || Stethoscope;
                                const features = (isAm ? service.featuresAm : service.featuresEn) || [];
                                return (
                                    <div key={service.id || index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                                        <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                            <Icon size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                            {isAm ? service.titleAm : service.titleEn}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {isAm ? service.descriptionAm : service.descriptionEn}
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            {features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-sm font-semibold text-gray-500">
                                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        {isAm ? "የልብዎን ጤና ለመጠበቅ ዝግጁ ነዎት?" : "Ready to prioritize your heart health?"}
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                        {isAm
                            ? "ከምርጥ የልብ ሐኪሞቻችን ጋር ቀጠሮ ይያዙ እና ወደ ጤናማ ህይወት ጉዞዎን ይጀምሩ።"
                            : "Book a consultation with our expert cardiologists today and take the first step towards a healthier future."
                        }
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition flex items-center justify-center gap-2 mx-auto"
                    >
                        <span>{isAm ? "ቀጠሮ ያስይዙ" : "Book Appointment Now"}</span>
                        <ArrowRight />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ServicesPage;
