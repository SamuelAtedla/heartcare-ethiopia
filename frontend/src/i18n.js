import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    navHome: "Home",
                    navServices: "Services",
                    btnBook: "Book Appointment",
                    heroBadge: "Trusted Cardiology Experts",
                    heroTitle: "Professional Heart Care",
                    heroTitleSuffix: "In the Palm of Your Hand.",
                    heroDesc: "Specialized consultancy for hypertension, heart failure, and lifestyle prevention. Connect with top cardiologists via WhatsApp & Telegram.",
                    btnRegister: "Register Now",
                    heroStats: "500+ Patients Helped",
                    responseTitle: "Response Time",
                    responseTime: "Under 30 Mins",
                    step1: "1. Registration",
                    step2: "2. Payment",
                    step3: "3. Connect",
                    formTitle: "Patient Information",
                    labelName: "Full Name",
                    labelPhone: "Phone Number",
                    labelConcern: "Heart Concern / Symptoms",
                    opt1: "Hypertension (High BP)",
                    opt2: "Chest Pain / Discomfort",
                    opt3: "Irregular Heartbeat",
                    opt4: "Preventative Check-up",
                    opt5: "Second Opinion on Diagnosis",
                    labelPlatform: "Preferred Platform",
                    labelDate: "Appointment Date",
                    btnProceed: "Proceed to Payment",
                    payTitle: "Confirm & Pay",
                    payFee: "Consultancy Fee:",
                    paySecure: "Secure Transaction powered by Chapa/SantimPay",
                    confTitle: "Booking Confirmed!",
                    commNow: "Start Communication Now:",
                    btnWA: "Connect via WhatsApp",
                    btnTG: "Connect via Telegram",
                    confNote: "Please have your previous medical reports ready to share.",
                    footPrivacy: "Privacy Policy",
                    footTerms: "Terms of Service",
                    footContact: "Contact Us",
                    alertFill: "Please fill in all required fields.",
                }
            },
            am: {
                translation: {
                    navHome: "ዋና ገጽ",
                    navServices: "አገልግሎቶች",
                    btnBook: "ቀጠሮ ይያዙ",
                    heroBadge: "ታማኝ የልብ ህክምና ባለሙያዎች",
                    heroTitle: "ፕሮፌሽናል የልብ ህክምና",
                    heroTitleSuffix: "በቤትዎ።",
                    heroDesc: "ለደም ግፊት፣ ለልብ ድካም እና ለጤናማ አኗኗር ልዩ ምክክር። በዋትስአፕ (WhatsApp) እና ቴሌግራም ከልብ ስፔሻሊስቶች ጋር ይገናኙ።",
                    btnRegister: "አሁኑኑ ይመዝገቡ",
                    heroStats: "500+ ታካሚዎች ተረድተዋል",
                    responseTitle: "የምላሽ ጊዜ",
                    responseTime: "ከ30 ደቂቃ በታች",
                    step1: "1. ምዝገባ",
                    step2: "2. ክፍያ",
                    step3: "3. ግንኙነት",
                    formTitle: "የታካሚ መረጃ",
                    labelName: "ሙሉ ስም",
                    labelPhone: "ስልክ ቁጥር",
                    labelConcern: "የልብ ህመም ስሜት / ምልክቶች",
                    opt1: "የደም ግፊት (High BP)",
                    opt2: "የደረት ህመም / ምቾት ማጣት",
                    opt3: "መደበኛ ያልሆነ የልብ ትርታ",
                    opt4: "የቅድመ መከላከል ምርመራ",
                    opt5: "የሁለተኛ ደረጃ የህክምና አስተያየት",
                    labelPlatform: "የሚመርጡት መገናኛ",
                    labelDate: "የቀጠሮ ቀን",
                    btnProceed: "ወደ ክፍያ ይለፉ",
                    payTitle: "ያረጋግጡ እና ይክፈሉ",
                    payFee: "የምክክር ክፍያ:",
                    paySecure: "ደህንነቱ የተጠበቀ ክፍያ በ Chapa/SantimPay",
                    confTitle: "ቀጠሮዎ ተረጋግጧል!",
                    commNow: "አሁኑኑ ይገናኙ:",
                    btnWA: "በዋትስአፕ ይገናኙ",
                    btnTG: "በቴሌግራም ይገናኙ",
                    confNote: "እባክዎን የቀድሞ የህክምና ሪፖርቶችዎን ለማጋራት ያዘጋጁ።",
                    footPrivacy: "የግላዊነት ፖሊሲ",
                    footTerms: "የአጠቃቀም ደንቦች",
                    footContact: "ያግኙን",
                    alertFill: "እባክዎን ሁሉንም አስፈላጊ ቦታዎች ይሙሉ"
                }
            }
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
