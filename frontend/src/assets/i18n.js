import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Heart Care Ethiopia",
      "book_now": "Book Appointment",
      "confirmed": "Confirmed",
      "pending": "Pending Payment",
      "phone_label": "Phone Number",
      "doctor_login": "Specialist Access"
    }
  },
  am: {
    translation: {
      "welcome": "እንኳን ወደ ልብ እንክብካቤ ኢትዮጵያ በደህና መጡ",
      "book_now": "ቀጠሮ ይያዙ",
      "confirmed": "ተረጋግጧል",
      "pending": "ክፍያ በመጠባበቅ ላይ",
      "phone_label": "የስልክ ቁጥር",
      "doctor_login": "ለሐኪሞች ብቻ"
    }
  }
};

i18n
  .use(LanguageDetector) // Automatically detects user language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;