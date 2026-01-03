// Use a simple in-memory store for the prototype
let articles = [
    {
        id: 1,
        title_en: "Managing Hypertension Naturally",
        title_am: "የደም ግፊትን በተፈጥሮ መንገድ መቆጣጠር",
        content_en: "High blood pressure can be managed with lifestyle changes including diet rich in potassium, regular exercise, and stress management.",
        content_am: "ከፍተኛ የደም ግፊትን የአኗኗር ዘይቤን በመቀየር፣ በፖታስየም የበለፀጉ ምግቦችን በመመገብ እና ጭንቀትን በመቀነስ መቆጣጠር ይቻላል።",
        image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title_en: "Signs of Heart Failure",
        title_am: "የልብ ድካም ምልክቶች",
        content_en: "Common signs include shortness of breath, fatigue, swollen legs, and rapid heartbeat. Early detection is key.",
        content_am: "የተለመዱ ምልክቶች የትንፋሽ ማጠር፣ ድካም፣ የእግር እብጠት እና የልብ ምት መፋጠን ናቸው። በጊዜ መመርመር ወሳኝ ነው።",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title_en: "The Benefits of Walking",
        title_am: "የእግር ጉዞ ጥቅሞች",
        content_en: "Walking 30 minutes a day significantly reduces the risk of heart disease and stroke.",
        content_am: "በቀን 30 ደቂቃ በእግር መሄድ ለልብ ህመም እና ለስትሮክ የመጋለጥ እድልን በእጅጉ ይቀንሳል።",
        image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800"
    }
];

export const doctors = [
    {
        id: 1,
        name: "Dr. Samuel Atedla",
        specialty: "Interventional Cardiologist",
        image: "https://i.pravatar.cc/300?u=dr_sam",
        bio: "Dr. Samuel has over 15 years of experience treating complex heart conditions. He is passionate about preventative care.",
        credentials: "MD, Addis Ababa University; Fellowship in Cardiology (Germany)"
    },
    {
        id: 2,
        name: "Dr. Sara Bekele",
        specialty: "Pediatric Cardiologist",
        image: "https://i.pravatar.cc/300?u=dr_sara",
        bio: "Dedicated to treating heart conditions in children with a gentle and compassionate approach.",
        credentials: "MD, Jimma University; Pediatric Residency (USA)"
    },
    {
        id: 3,
        name: "Dr. Kebede Tadesse",
        specialty: "Electrophysiologist",
        image: "https://i.pravatar.cc/300?u=dr_kebede",
        bio: "Expert in managing irregular heartbeats (arrhythmias) using advanced technology.",
        credentials: "MD, Gondar University; PhD in Electrophysiology (UK)"
    },
    {
        id: 4,
        name: "Dr. Yibeltal Assefa Tedla, MD, FACC",
        specialty: "Adult Cardiologist | Internal Medicine Specialist",
        image: "https://i.pravatar.cc/300?u=dr_yibeltal_real",
        bio: `Adult Cardiologist | Internal Medicine Specialist
📍 Addis Ababa, Ethiopia | 📞 +251 911 728 203

CAREER OBJECTIVE
Adult Cardiologist committed to academic excellence, procedural competence, and evidence-based cardiovascular care. Currently aiming to advance interventional cardiology services in Ethiopia.

CURRENT APPOINTMENT
Physician, Adult Cardiologist at St. Peter Specialized Hospital (Jan 2023 – Present).
Manages acute coronary syndromes, heart failure, arrhythmias, and valvular heart disease. Performs Coronary Angiography, Echocardiography, and participates in PCI procedures.

EDUCATION & TRAINING
- Adult Cardiology Fellowship: St. Paul’s Hospital Millennium Medical College (2020–2023) with Interventional Cardiology Observership at St. John's Medical College, India.
- Internal Medicine Residency: Addis Ababa University (2009–2013).
- Doctor of Medicine (MD): Jimma University (1998–2004).

PROFESSIONAL EXPERIENCE
- Internal Medicine Physician: Brook Internal Medicine Specialized Center (2013–2020).
- Lecturer & MD: Debre Birhan University (2008–2009).
- Medical Doctor: Médecins Sans Frontières (MSF-Holland) (2006–2007).

SKILLS
- Coronary Angiography & PCI (Assisting)
- Echocardiography (TTE, TEE) & Stress Echo
- Temporary Transvenous Pacemaker Insertion

LANGUAGES
- English (Fluent)
- Amharic (Native)`,
        credentials: "MD, FACC, CCKE (ACC Certified)"
    }
];

export const getArticles = () => articles;

export const addArticle = (article) => {
    const newArticle = { ...article, id: Date.now() };
    articles.unshift(newArticle); // Add to top
    return newArticle;
};
