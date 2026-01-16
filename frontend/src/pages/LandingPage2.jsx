import React from 'react';
import Header from '../components/Header';
import HeroWithCarousel from '../components/HeroWithCarousel';
import ArticleGrid from '../components/ArticleGrid';
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

            {/* Main Emphasis: Hero with Doctor Carousel integrated */}
            <HeroWithCarousel />

            {/* Articles placed below it - Using Grid for visual balance */}
            <ArticleGrid />

            {/* Keep the gallery and footer */}
            <SpecialistGallery />
            <Footer />
        </div>
    );
};

export default LandingPage2;
