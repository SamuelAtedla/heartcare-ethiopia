const { User, Article, Service, Appointment, Payment, MedicalAttachment, Availability } = require('../src/models');
const bcrypt = require('bcryptjs');
const sequelize = require('../src/config/database');

async function prepareProduction() {
    try {
        console.log('🚀 Starting Production Preparation...');

        // 1. Truncate all tables to ensure a clean slate
        // Use CASCADE to handle foreign key constraints
        await sequelize.query('TRUNCATE TABLE "users", "articles", "services", "appointments", "payments", "medical_attachments", "availabilities" RESTART IDENTITY CASCADE;');
        console.log('✅ All tables truncated.');

        const hashedPassword = await bcrypt.hash('password123', 12); // User should change this immediately

        // 2. Add Dr. Yebeltal as the ONLY user
        const yebeltal = await User.create({
            fullName: "Dr. Yebeltal Assefa Tedla, MD, FACC",
            phone: '0911728203',
            email: 'yebeltal@heartcareethiopia.com',
            password: hashedPassword,
            role: 'doctor',
            isAdmin: true,
            isApproved: true,
            specialty: "Adult Cardiologist | Internal Medicine Specialist",
            bio: "Adult Cardiologist committed to academic excellence, procedural competence, and evidence-based cardiovascular care. Currently aiming to advance interventional cardiology services in Ethiopia.",
            credentials: "MD, FACC, CCKE (ACC Certified)"
        });
        console.log('✅ Dr. Yebeltal created as the sole user.');

        // 3. Add 6 Default Services
        const servicesData = [
            {
                iconName: 'Stethoscope',
                titleEn: "Expert Cardiac Consultation",
                titleAm: "የልብ ህክምና የምክር አገልግሎት",
                descriptionEn: "Comprehensive evaluation by specialized cardiologists. We treat conditions such as Chest Pain, Palpitations, Shortness of Breath, and Dizziness.",
                descriptionAm: "በልዩ የልብ ሐኪሞች የሚሰጥ ዝርዝር ምርመራ። የደረት ህመም፣ የልብ ምት መዛባት፣ የትንፋሽ ማጠር እና የማዞር ስሜት ህክምና እንሰጣለን።",
                featuresEn: ["Detailed Physical Exam", "Symptom Analysis", "Medication Review"],
                featuresAm: ["አጠቃላይ የአካል ምርመራ", "የምልክቶች ትንተና", "የመድሃኒት ክለሳ"],
                order: 1
            },
            {
                iconName: 'Activity',
                titleEn: "Hypertension Clinic",
                titleAm: "የደም ግፊት ክትትል",
                descriptionEn: "Specialized management of High Blood Pressure. We focus on controlling your numbers to prevent strokes, heart attacks, and kidney damage.",
                descriptionAm: "ልዩ የደም ግፊት ህክምና እና ክትትል። ስትሮክን፣ የልብ ህመምን እና የኩላሊት ጉዳትን ለመከላከል የደም ግፊትዎን እንቆጣጠራለን።",
                featuresEn: ["Personalized Medication Plan", "Home Monitoring Guidance", "Lifestyle Coaching"],
                featuresAm: ["የግል የመድሃኒት አሰጣጥ", "የቤት ውስጥ ክትትል ምክር", "የአኗኗር ዘይቤ ምክር"],
                order: 2
            },
            {
                iconName: 'ShieldCheck',
                titleEn: "Preventive Cardiology",
                titleAm: "ቅድመ-መከላከል ህክምና",
                descriptionEn: "Don't wait for symptoms. We assess your risk factors (Cholesterol, Diabetes, Family History) to stop heart disease before it starts.",
                descriptionAm: "ምልክቶች እስኪታዩ አይጠብቁ። የልብ ህመም ከመጀመሩ በፊት የኮሌስትሮል፣ የስኳር እና የቤተሰብ ታሪክዎን በማየት እንከላከላለን።",
                featuresEn: ["Risk Scoring", "Dietary Counseling", "Exercise Prescriptions"],
                featuresAm: ["የአደጋ ግምገማ", "የአመጋገብ ምክር", "የአካል ብቃት እንቅስቃሴ"],
                order: 3
            },
            {
                iconName: 'Heart',
                titleEn: "Heart Failure Management",
                titleAm: "የልብ ድካም ህክምና",
                descriptionEn: "Long-term compassionate care for patients with weak hearts. Our goal is to improve your quality of life and reduce hospital visits.",
                descriptionAm: "የልብ አቅም ማነስ ላጋጠማቸው ታካሚዎች የሚሰጥ የረጅም ጊዜ እንክብካቤ። አላማችን የህይወት ጥራትን ማሻሻል ነው።",
                featuresEn: ["Fluid Management", "Advanced Therapy Options", "Ongoing Monitoring"],
                featuresAm: ["የፈሳሽ መጠን ቁጥጥር", "የላቀ የህክምና አማራጮች", "ቀጣይነት ያለው ክትትል"],
                order: 4
            },
            {
                iconName: 'ClipboardCheck',
                titleEn: "Pre-Operative Clearance",
                titleAm: "ከቀዶ ጥገና በፊት ምርመራ",
                descriptionEn: "Cardiac assessment before non-cardiac surgeries. We ensure your heart is strong enough to withstand anesthesia and surgery.",
                descriptionAm: "ከማንኛውም ቀዶ ጥገና በፊት የሚደረግ የልብ ምርመራ። ልብዎ ማደንዘዣን እና ቀዶ ጥገናን መቋቋም እንደሚችል እናረጋግጣለን።",
                featuresEn: ["Risk Stratification", "Coordination with Surgeons", "Safety Optimization"],
                featuresAm: ["የአደጋ ትንተና", "ከቀዶ ጥገና ሐኪሞች ጋር ምክክር", "የደህንነት ማረጋገጫ"],
                order: 5
            },
            {
                iconName: 'UserCheck',
                titleEn: "Second Opinion Services",
                titleAm: "የተጨማሪ ሀኪም ማረጋገጫ",
                descriptionEn: "Have a diagnosis but want peace of mind? We review your existing records and treatment plans to ensure you're on the right path.",
                descriptionAm: "የተሰጠዎትን ህክምና ማረጋገጥ ይፈልጋሉ? ያለዎትን የህክምና መረጃ በመገምገም ትክክለኛውን ውሳኔ እንዲወስኑ እናግዛለን።",
                featuresEn: ["Record Review", "Treatment Validation", "Mental Peace"],
                featuresAm: ["የህክምና መረጃ ግምገማ", "የህክምና ትክክለኛነት ማረጋገጫ", "የአእምሮ ሰላም"],
                order: 6
            }
        ];

        await Service.bulkCreate(servicesData);
        console.log('✅ 6 Default Services added.');

        // 4. Add Two Good Articles
        const articlesData = [
            {
                titleEn: "Living with Hypertension: A Guide for Healthy Living",
                titleAm: "ከደም ግፊት ጋር መኖር፡ ለጤናማ ህይወት መመሪያ",
                contentEn: "Hypertension is a chronic condition that requires lifelong management. By controlling your blood pressure through diet, exercise, and medication as prescribed, you can lead a long and healthy life. Key tips include reducing salt intake, staying physically active, and monitoring your blood pressure regularly at home.",
                contentAm: "የደም ግፊት የረጅም ጊዜ ክትትል የሚያስፈልገው የጤና ሁኔታ ነው። በአመጋገብ፣ በአካል ብቃት እንቅስቃሴ እና በተገቢው የመድኃኒት አጠቃቀም የደም ግፊትን በመቆጣጠር ረጅም እና ጤናማ ሕይወት መምራት ይቻላል። ዋና ዋና ምክሮች የጨው አጠቃቀምን መቀነስ፣ የአካል ብቃት እንቅስቃሴ ማድረግ እና በመደበኛነት የደም ግፊትን መለካት ናቸው።",
                image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000",
                doctorId: yebeltal.id
            },
            {
                titleEn: "Warning Signs of a Heart Attack You Should Never Ignore",
                titleAm: "የማይናቁ የልብ ድካም (Heart Attack) ምልክቶች",
                contentEn: "Early recognition of heart attack symptoms is critical for survival. Signs include chest discomfort, pain in the upper body, shortness of breath, and cold sweats. If you or someone around you experiences these symptoms, seek emergency medical care immediately. Time is muscle when it comes to the heart.",
                contentAm: "የልብ ድካም ምልክቶችን ቀድሞ መረዳት ሕይወትን ለማዳን በጣም አስፈላጊ ነው። ምልክቶቹ የደረት ምቾት ማጣት፣ የላይኛው የሰውነት ክፍል ህመም፣ የትንፋሽ ማጠር እና ቀዝቃዛ ላብ ያካትታሉ። እርስዎ ወይም በአቅራቢያዎ ያለ ሰው እነዚህ ምልክቶች ከታዩበት ወዲያውኑ ወደ ህክምና ተቋም ይሂዱ። ለልብ ጤና ጊዜ ወሳኝ ነው።",
                image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000",
                doctorId: yebeltal.id
            }
        ];

        await Article.bulkCreate(articlesData);
        console.log('✅ 2 High-quality Articles added.');

        console.log('✨ Production Preparation Completed Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during production preparation:', error);
        process.exit(1);
    }
}

prepareProduction();
