import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heart, Activity, Stethoscope, ClipboardCheck, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesPage = () => {
    const navigate = useNavigate();

    const services = [
        {
            icon: Stethoscope,
            title: "Expert Cardiac Consultation",
            desc: "Comprehensive evaluation by specialized cardiologists. We treat conditions such as Chest Pain, Palpitations, Shortness of Breath, and Dizziness.",
            features: ["Detailed Physical Exam", "Symptom Analysis", "Medication Review"]
        },
        {
            icon: Activity,
            title: "Hypertension Clinic",
            desc: "Specialized management of High Blood Pressure. We focus on controlling your numbers to prevent strokes, heart attacks, and kidney damage.",
            features: ["Personalized Medication Plan", "Home Monitoring Guidance", "Lifestyle Coaching"]
        },
        {
            icon: ShieldCheck,
            title: "Preventive Cardiology",
            desc: "Don't wait for symptoms. We assess your risk factors (Cholesterol, Diabetes, Family History) to stop heart disease before it starts.",
            features: ["Risk Scoring", "Dietary Counseling", "Exercise Prescriptions"]
        },
        {
            icon: Heart,
            title: "Heart Failure Management",
            desc: "Long-term compassionate care for patients with weak hearts. Our goal is to improve your quality of life and reduce hospital visits.",
            features: ["Fluid Management", "Advanced Therapy Options", "Ongoing Monitoring"]
        },
        {
            icon: ClipboardCheck,
            title: "Pre-Operative Clearance",
            desc: "Cardiac assessment before non-cardiac surgeries. We ensure your heart is strong enough to withstand anesthesia and surgery.",
            features: ["Risk Stratification", "Coordination with Surgeons", "Safety Optimization"]
        },
        {
            icon: UserCheck,
            title: "Second Opinion Services",
            desc: "Have a diagnosis but want peace of mind? We review your existing records and treatment plans to ensure you're on the right path.",
            features: ["Record Review", "Treatment Validation", "Mental Peace"]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Header Section */}
            <section className="bg-red-600 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
                    <p className="text-xl md:text-2xl text-red-100 max-w-2xl mx-auto font-light">
                        Comprehensive cardiovascular care tailored to your unique needs. From prevention to complex management, we are here for your heart.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                                <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <service.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.desc}
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm font-semibold text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to prioritize your heart health?</h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                        Book a consultation with our expert cardiologists today and take the first step towards a healthier future.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition flex items-center justify-center gap-2 mx-auto"
                    >
                        <span>Book Appointment Now</span>
                        <ArrowRight />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ServicesPage;
