import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="mb-4">© 2024 Heart Care Ethiopia. All Rights Reserved.</p>
                <div className="flex justify-center space-x-6 text-gray-400">
                    <a href="#" className="hover:text-white">{t('footPrivacy', 'Privacy Policy')}</a>
                    <a href="#" className="hover:text-white">{t('footTerms', 'Terms of Service')}</a>
                    <a href="#" className="hover:text-white">{t('footContact', 'Contact Us')}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
