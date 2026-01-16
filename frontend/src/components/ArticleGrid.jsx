import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock } from 'lucide-react';
import apiClient, { getFileUrl } from '../api/axiosConfig';

const ArticleGrid = () => {
    const { t, i18n } = useTranslation();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedArticle, setExpandedArticle] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await apiClient.get('/public/articles');
                setArticles(response.data.slice(0, 3));
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading insights...</div>
            </section>
        );
    }

    if (articles.length === 0) return null;

    const isAm = i18n.language === 'am';

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Corrected Header Hierarchy */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-gray-200 pb-8">
                    <div className="flex-grow">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 truncate">
                            {t('healthInsights', 'Health Insights')}
                        </h2>
                        <p className="text-gray-500 font-medium text-lg md:text-xl truncate">
                            {t('teamIntro', 'Curated articles from our specialists')}
                        </p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all whitespace-nowrap bg-white px-6 py-3 rounded-2xl shadow-sm hover:shadow-md">
                        {t('viewAll', 'View All Articles')} <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
                            onClick={() => setExpandedArticle(article)}
                        >
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={getFileUrl(article.image)}
                                    alt={isAm ? article.titleAm : article.titleEn}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-gray-900 flex items-center gap-2 shadow-sm">
                                    <Clock size={12} />
                                    <span>{new Date(article.createdAt).toLocaleDateString(i18n.language === 'am' ? 'am-ET' : 'en-US')}</span>
                                </div>
                            </div>

                            <div className="p-10 flex-grow flex flex-col">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                                    {isAm ? article.titleAm : article.titleEn}
                                </h3>
                                <p className="text-gray-500 mb-8 line-clamp-3 text-base leading-relaxed">
                                    {isAm ? article.contentAm : article.contentEn}
                                </p>
                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        {t('latestArticle', 'Latest')}
                                    </span>
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <ArrowRight size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <button className="md:hidden mt-12 w-full flex items-center justify-center gap-2 text-red-600 font-bold bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
                    {t('viewAll', 'View All Articles')} <ArrowRight size={18} />
                </button>
            </div>

            {/* Modal Detail View */}
            {expandedArticle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white text-gray-900 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-300 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-80 md:h-[28rem] shrink-0">
                            <img
                                src={getFileUrl(expandedArticle.image)}
                                alt="Detail"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 top-0 p-8 flex justify-end">
                                <button
                                    onClick={() => setExpandedArticle(null)}
                                    className="bg-black/20 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-black/40 transition-all border border-white/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                                </button>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-white via-white/80 to-transparent">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-red-600 font-black bg-white/50 backdrop-blur-sm border border-red-100 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest shadow-sm">
                                        {t('healthInsights', 'Health Insights')}
                                    </span>
                                    <span className="text-gray-500 text-xs font-bold">
                                        {new Date(expandedArticle.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1]">
                                    {isAm ? expandedArticle.titleAm : expandedArticle.titleEn}
                                </h2>
                            </div>
                        </div>

                        <div className="p-12 pt-0 overflow-y-auto">
                            <div className="prose prose-lg text-gray-600 max-w-none whitespace-pre-line leading-relaxed pb-12">
                                {isAm ? expandedArticle.contentAm : expandedArticle.contentEn}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ArticleGrid;
