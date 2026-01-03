import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ArticleCarousel from '../components/ArticleCarousel';
import SpecialistGallery from '../components/SpecialistGallery';
import Footer from '../components/Footer';

const LandingPage = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Header scrollToSection={scrollToSection} />
            <Hero scrollToSection={scrollToSection} />

            {/* New Features */}
            <ArticleCarousel />
            <SpecialistGallery />

            <Footer />
        </div>
    );
};

export default LandingPage;
