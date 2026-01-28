import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heart, Activity, Stethoscope, ClipboardCheck, UserCheck, ShieldCheck, ArrowRight, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/axiosConfig';

const iconMap = {
    Heart, Activity, Stethoscope, ClipboardCheck, UserCheck, ShieldCheck, Layout
};

const ServicesPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isAm = i18n.language === 'am';
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const staticServices = [
        {
            iconName: 'Stethoscope',
            titleEn: "Expert Cardiac Consultation",
            titleAm: "የልብ ህክምና የምክር አገልግሎት",
            descriptionEn: "Comprehensive evaluation by specialized cardiologists. We treat conditions such as Chest Pain, Palpitations, Shortness of Breath, and Dizziness.",
            descriptionAm: "በልዩ የልብ ሐኪሞች የሚሰጥ ዝርዝር ምርመራ። የደረት ህመም፣ የልብ ምት መዛባት፣ የትንፋሽ ማጠር እና የማዞር ስሜት ህክምና እንሰጣለን።",
            featuresEn: ["Detailed Physical Exam", "Symptom Analysis", "Medication Review"],
            featuresAm: ["አጠቃላይ የአካል ምርመራ", "የምልክቶች ትንተና", "የመድሃኒት ክለሳ"]
        },
        {
            iconName: 'Activity',
            titleEn: "Hypertension Clinic",
            titleAm: "የደም ግፊት ክትትል",
            descriptionEn: "Specialized management of High Blood Pressure. We focus on controlling your numbers to prevent strokes, heart attacks, and kidney damage.",
            descriptionAm: "ልዩ የደም ግፊት ህክምና እና ክትትል። ስትሮክን፣ የልብ ህመምን እና የኩላሊት ጉዳትን ለመከላከል የደም ግፊትዎን እንቆጣጠራለን።",
            featuresEn: ["Personalized Medication Plan", "Home Monitoring Guidance", "Lifestyle Coaching"],
            featuresAm: ["የግል የመድሃኒት አሰጣጥ", "የቤት ውስጥ ክትትል ምክር", "የአኗኗር ዘይቤ ምክር"]
        },
        {
            iconName: 'ShieldCheck',
            titleEn: "Preventive Cardiology",
            titleAm: "ቅድመ-መከላከል ህክምና",
            descriptionEn: "Don't wait for symptoms. We assess your risk factors (Cholesterol, Diabetes, Family History) to stop heart disease before it starts.",
            descriptionAm: "ምልክቶች እስኪታዩ አይጠብቁ። የልብ ህመም ከመጀመሩ በፊት የኮሌስትሮል፣ የስኳር እና የቤተሰብ ታሪክዎን በማየት እንከላከላለን።",
            featuresEn: ["Risk Scoring", "Dietary Counseling", "Exercise Prescriptions"],
            featuresAm: ["የአደጋ ግምገማ", "የአመጋገብ ምክር", "የአካል ብቃት እንቅስቃሴ"]
        },
        {
            iconName: 'Heart',
            titleEn: "Heart Failure Management",
            titleAm: "የልብ ድካም ህክምና",
            descriptionEn: "Long-term compassionate care for patients with weak hearts. Our goal is to improve your quality of life and reduce hospital visits.",
            descriptionAm: "የልብ አቅም ማነስ ላጋጠማቸው ታካሚዎች የሚሰጥ የረጅም ጊዜ እንክብካቤ። አላማችን የህይወት ጥራትን ማሻሻል ነው።",
            featuresEn: ["Fluid Management", "Advanced Therapy Options", "Ongoing Monitoring"],
            featuresAm: ["የፈሳሽ መጠን ቁጥጥር", "የላቀ የህክምና አማራጮች", "ቀጣይነት ያለው ክትትል"]
        },
        {
            iconName: 'ClipboardCheck',
            titleEn: "Pre-Operative Clearance",
            titleAm: "ከቀዶ ጥገና በፊት ምርመራ",
            descriptionEn: "Cardiac assessment before non-cardiac surgeries. We ensure your heart is strong enough to withstand anesthesia and surgery.",
            descriptionAm: "ከማንኛውም ቀዶ ጥገና በፊት የሚደረግ የልብ ምርመራ። ልብዎ ማደንዘዣን እና ቀዶ ጥገናን መቋቋም እንደሚችል እናረጋግጣለን።",
            featuresEn: ["Risk Stratification", "Coordination with Surgeons", "Safety Optimization"],
            featuresAm: ["የአደጋ ትንተና", "ከቀዶ ጥገና ሐኪሞች ጋር ምክክር", "የደህንነት ማረጋገጫ"]
        },
        {
            iconName: 'UserCheck',
            titleEn: "Second Opinion Services",
            titleAm: "የተጨማሪ ሀኪም ማረጋገጫ",
            descriptionEn: "Have a diagnosis but want peace of mind? We review your existing records and treatment plans to ensure you're on the right path.",
            descriptionAm: "የተሰጠዎትን ህክምና ማረጋገጥ ይፈልጋሉ? ያለዎትን የህክምና መረጃ በመገምገም ትክክለኛውን ውሳኔ እንዲወስኑ እናግዛለን።",
            featuresEn: ["Record Review", "Treatment Validation", "Mental Peace"],
            featuresAm: ["የህክምና መረጃ ግምገማ", "የህክምና ትክክለኛነት ማረጋገጫ", "የአእምሮ ሰላም"]
        }
    ];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await apiClient.get('/services');
                if (response.data && response.data.length > 0) {
                    setServices(response.data);
                } else {
                    setServices(staticServices);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                setServices(staticServices);
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
                                return (
                                    <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
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
                                            {(isAm ? service.featuresAm : service.featuresEn).map((feature, idx) => (
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
