import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, PauseCircle, PlayCircle } from 'lucide-react';
import apiClient, { getFileUrl } from '../api/axiosConfig';

const ArticleCarousel = () => {
    const { t, i18n } = useTranslation();
    const [articles, setArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [expandedArticle, setExpandedArticle] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await apiClient.get('/public/articles');
                setArticles(response.data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        if (!isPaused && !expandedArticle && articles.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % articles.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isPaused, expandedArticle, articles.length]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setExpandedArticle(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (articles.length === 0) return null;

    const currentArticle = articles[currentIndex];
    const isAm = i18n.language === 'am';

    return (
        <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-red-600 blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600 blur-3xl opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{t('healthInsights', 'Health Insights')}</h2>
                        <p className="text-gray-400">{t('teamIntro', 'Curated articles from our specialists')}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsPaused(!isPaused)} className="text-gray-400 hover:text-white transition">
                            {isPaused ? <PlayCircle size={24} /> : <PauseCircle size={24} />}
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {/* Carousel Card */}
                    <div
                        className="bg-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-700 ease-in-out"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="md:w-1/2 h-64 md:h-auto relative">
                            <img
                                src={getFileUrl(currentArticle.image)}
                                alt="Article"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-3">
                                {t('latestArticle', 'Latest Article')}
                            </span>
                            <h3 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                                {isAm ? currentArticle.titleAm : currentArticle.titleEn}
                            </h3>
                            <p className="text-gray-400 mb-8 line-clamp-3">
                                {isAm ? currentArticle.contentAm : currentArticle.contentEn}
                            </p>
                            <button
                                onClick={() => setExpandedArticle(currentArticle)}
                                className="group flex items-center gap-2 text-white font-bold hover:text-red-500 transition w-fit"
                            >
                                <span>{t('readFull', 'Read Full Article')}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                            </button>
                        </div>
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex justify-center mt-8 gap-3">
                        {articles.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-12 bg-red-600' : 'w-4 bg-gray-700 hover:bg-gray-600'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Expanded Article Modal */}
            {expandedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white text-gray-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setExpandedArticle(null)}
                            className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                        </button>
                        <img src={getFileUrl(expandedArticle.image)} alt="Detail" className="w-full h-64 object-cover rounded-2xl mb-8" />
                        <h2 className="text-3xl font-bold mb-4">
                            {isAm ? expandedArticle.titleAm : expandedArticle.titleEn}
                        </h2>
                        <div className="prose prose-lg text-gray-600 whitespace-pre-line mb-8">
                            {isAm ? expandedArticle.contentAm : expandedArticle.contentEn}
                        </div>

                        {expandedArticle.attachment && (
                            <div className="border-t border-gray-100 pt-6">
                                <a
                                    href={getFileUrl(expandedArticle.attachment)}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                    {t('downloadAttachment', 'Download Reference Material')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ArticleCarousel;
