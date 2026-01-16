import React from 'react';
import Header from '../components/Header';
import DoctorCarousel from '../components/DoctorCarousel';
import ArticleCarousel from '../components/ArticleCarousel';
import SpecialistGallery from '../components/SpecialistGallery';
import Footer from '../components/Footer';

const LandingPage2 = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header scrollToSection={scrollToSection} />

            {/* Main Emphasis: Doctor Carousel at the top */}
            <DoctorCarousel />

            {/* Articles placed below it */}
            <ArticleCarousel />

            {/* Keep the gallery and footer */}
            <SpecialistGallery />
            <Footer />
        </div>
    );
};

export default LandingPage2;
