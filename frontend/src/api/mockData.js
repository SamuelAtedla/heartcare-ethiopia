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
    }
];

export const getArticles = () => articles;

export const addArticle = (article) => {
    const newArticle = { ...article, id: Date.now() };
    articles.unshift(newArticle); // Add to top
    return newArticle;
};
