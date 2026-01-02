import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

 const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang; // Updates HTML lang attribute
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 active:bg-slate-50 transition-colors"
    >
      <Globe size={16} className="text-red-600" />
      {i18n.language === 'en' ? 'አማርኛ' : 'English'}
    </button>
  );
};
export default LanguageSwitcher;