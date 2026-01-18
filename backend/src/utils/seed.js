const { User, Appointment, Article, Availability, Payment, MedicalAttachment } = require('../models');
const bcrypt = require('bcryptjs');

const seedInitialData = async () => {
    try {
        console.log('🌱 Starting comprehensive database seeding...');

        const hashedPassword = await bcrypt.hash('password123', 12);

        // 1. Seed Doctors
        const doctorsData = [
            {
                fullName: "Dr. Yebeltal Assefa Tedla, MD, FACC",
                phone: '0911728203',
                email: 'yebeltal@heartcareethiopia.com',
                password: hashedPassword,
                role: 'doctor',
                specialty: "Adult Cardiologist | Internal Medicine Specialist",
                profileImage: "https://i.pravatar.cc/300?u=dr_yibeltal",
                bio: "Adult Cardiologist committed to academic excellence, procedural competence, and evidence-based cardiovascular care. Currently aiming to advance interventional cardiology services in Ethiopia.",
                credentials: "MD, FACC, CCKE (ACC Certified)"
            },
            {
                fullName: "Dr. Selamawit Alemu",
                phone: '0911223344',
                email: 'selamawit@heartcareethiopia.com',
                password: hashedPassword,
                role: 'doctor',
                specialty: "Pediatric Cardiologist",
                profileImage: "https://i.pravatar.cc/300?u=dr_selam",
                bio: "Specializing in congenital heart diseases and pediatric cardiac care with over 10 years of experience.",
                credentials: "MD, Pediatric Cardiology Specialist"
            },
            {
                fullName: "Dr. Kebede Tadesse",
                phone: '0911334455',
                email: 'kebede@heartcareethiopia.com',
                password: hashedPassword,
                role: 'doctor',
                specialty: "Cardiac Surgeon",
                profileImage: "https://i.pravatar.cc/300?u=dr_kebede",
                bio: "Expert in open-heart surgery and minimally invasive cardiac procedures.",
                credentials: "MD, PhD, Cardiothoracic Surgeon"
            }
        ];

        const createdDoctors = [];
        for (const dr of doctorsData) {
            const [user, created] = await User.findOrCreate({
                where: { phone: dr.phone },
                defaults: dr
            });
            if (created) console.log(`✅ Doctor ${dr.fullName} seeded.`);
            createdDoctors.push(user);
        }

        // 2. Seed Patients
        const patientsData = [
            {
                fullName: "Abebe Bikila",
                phone: '0900112233',
                email: 'abebe@example.com',
                password: hashedPassword,
                role: 'patient',
                age: 45
            },
            {
                fullName: "Martha Yohannes",
                phone: '0900445566',
                email: 'martha@example.com',
                password: hashedPassword,
                role: 'patient',
                age: 32
            },
            {
                fullName: "Tadesse Hailu",
                phone: '0900778899',
                email: 'tadesse@example.com',
                password: hashedPassword,
                role: 'patient',
                age: 58
            }
        ];

        const createdPatients = [];
        for (const pt of patientsData) {
            const [user, created] = await User.findOrCreate({
                where: { phone: pt.phone },
                defaults: pt
            });
            if (created) console.log(`✅ Patient ${pt.fullName} seeded.`);
            createdPatients.push(user);
        }

        // 3. Seed Availabilities for all Doctors
        for (const doctor of createdDoctors) {
            const days = [1, 2, 3, 4, 5]; // Mon to Fri
            for (const day of days) {
                await Availability.findOrCreate({
                    where: { doctorId: doctor.id, dayOfWeek: day },
                    defaults: {
                        doctorId: doctor.id,
                        dayOfWeek: day,
                        startTime: '09:00',
                        endTime: '17:00',
                        slotDuration: 30
                    }
                });
            }
            console.log(`✅ Availabilities for ${doctor.fullName} seeded.`);
        }

        // 4. Seed Articles
        const articlesData = [
            {
                titleEn: "Understanding Hypertension (High Blood Pressure)",
                titleAm: "የደም ግፊትን መረዳት",
                contentEn: "Hypertension, also known as high blood pressure, is a condition in which the force of the blood against the artery walls is too high. It can lead to severe health complications and increase the risk of heart disease, stroke, and sometimes death.",
                contentAm: "የደም ግፊት (Hypertension) ማለት ደም በደም ቅዳ ግድግዳዎች ላይ የሚያሳርፈው ግፊት ከተለመደው በላይ የሚሆንበት ሁኔታ ነው። ይህ ሁኔታ ለከፋ የጤና ችግሮች ይዳርጋል፤ ለልብ ህመም፣ ለስትሮክ እና አንዳንዴም ለሞት የመጋለጥ እድልን ይጨምራል።",
                image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000",
                doctorId: createdDoctors[0].id
            },
            {
                titleEn: "Healthy Eating for a Strong Heart",
                titleAm: "ለጠንካራ ልብ ጤናማ አመጋገብ",
                contentEn: "A heart-healthy diet is one of your best weapons for fighting cardiovascular disease. Focus on fruits, vegetables, whole grains, and lean proteins while limiting salt and saturated fats.",
                contentAm: "ለልብ ተስማሚ የሆነ አመጋገብ የልብና የደም ዝውውር ችግሮችን ለመከላከል ትልቁ መሳሪያ ነው። ጨውና ቅባትን በመቀነስ በአትክልትና ፍራፍሬ፣ በጥራጥሬዎች እና በፕሮቲን የበለጸጉ ምግቦች ላይ ትኩረት ያድርጉ።",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000",
                doctorId: createdDoctors[0].id
            },
            {
                titleEn: "Common Cardiac Symptoms You Shouldn't Ignore",
                titleAm: "የማይናቁ የልብ ህመም ምልክቶች",
                contentEn: "Chest pain, shortness of breath, and palpitations are some of the signs that your heart needs attention. Early diagnosis can save lives.",
                contentAm: "የደረት ህመም፣ የትንፋሽ ማጠር እና የልብ ትርታ መዛባት ልብዎ ትኩረት እንደሚፈልግ ከሚያሳዩ ምልክቶች ጥቂቶቹ ናቸው። ቀደም ብሎ ምርመራ ማድረግ ህይወትን ያድናል::",
                image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000",
                doctorId: createdDoctors[1].id
            },
            {
                titleEn: "The Importance of Regular Exercise",
                titleAm: "የመደበኛ የአካል ብቃት እንቅስቃሴ አስፈላጊነት",
                contentEn: "Physical activity is a key part of heart health. Even 30 minutes of brisk walking five days a week can significantly improve your cardiovascular health.",
                contentAm: "የአካል ብቃት እንቅስቃሴ ለልብ ጤና ቁልፍ ነው። በሳምንት አምስት ቀን በቀን ለ30 ደቂቃ ፈጠን ያለ እርምጃ መራመድ የልብና የደም ዝውውር ጤንነትን በእጅጉ ያሻሽላል።",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1000",
                doctorId: createdDoctors[2].id
            }
        ];

        for (const art of articlesData) {
            await Article.findOrCreate({
                where: { titleEn: art.titleEn },
                defaults: art
            });
        }
        console.log(`✅ ${articlesData.length} Articles seeded.`);

        // 5. Seed Appointments & Payments
        const appointmentsData = [
            {
                patientId: createdPatients[0].id,
                doctorId: createdDoctors[0].id,
                patientPhone: createdPatients[0].phone,
                communicationMode: 'zoom',
                scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
                status: 'confirmed',
                symptoms: "Mild chest pain and dizziness.",
                paymentReference: "PAY-EXAMPLE-001",
                clinicalNotes: "Patient reports history of hypertension."
            },
            {
                patientId: createdPatients[1].id,
                doctorId: createdDoctors[0].id,
                patientPhone: createdPatients[1].phone,
                communicationMode: 'whatsapp',
                scheduledAt: new Date(Date.now() + 172800000), // Day after tomorrow
                status: 'confirmed',
                symptoms: "Follow up after medication change.",
                paymentReference: "PAY-EXAMPLE-002"
            },
            {
                patientId: createdPatients[2].id,
                doctorId: createdDoctors[1].id,
                patientPhone: createdPatients[2].phone,
                communicationMode: 'telegram',
                scheduledAt: new Date(Date.now() + 259200000), // 3 days later
                status: 'confirmed',
                symptoms: "Occasional palpitations during exercise.",
                paymentReference: "PAY-EXAMPLE-003"
            }
        ];

        for (const appt of appointmentsData) {
            const [appointment, created] = await Appointment.findOrCreate({
                where: {
                    patientId: appt.patientId,
                    doctorId: appt.doctorId,
                    scheduledAt: appt.scheduledAt
                },
                defaults: appt
            });

            if (created) {
                // Seed a Payment for the appointment
                await Payment.findOrCreate({
                    where: { tx_ref: appt.paymentReference },
                    defaults: {
                        tx_ref: appt.paymentReference,
                        appointmentId: appointment.id,
                        method: 'manual_transfer',
                        status: 'success',
                        receiptPath: 'storage/samples/receipt.jpg'
                    }
                });

                // Seed a Medical Attachment for the first appointment
                if (appt.paymentReference === "PAY-EXAMPLE-001") {
                    await MedicalAttachment.create({
                        appointmentId: appointment.id,
                        fileName: 'Lab_Results_Abebe.pdf',
                        filePath: 'storage/samples/lab_results.pdf',
                        fileType: 'application/pdf'
                    });
                }
            }
        }
        console.log(`✅ Sample Appointments, Payments, and Attachments seeded.`);

        console.log('🚀 Database seeding completed successfully.');
        console.log('-----------------------------------------------');
        console.log('Sample Logins:');
        console.log('Doctor (Yebeltal): 0911728203 / password123');
        console.log('Doctor (Selamawit): 0911223344 / password123');
        console.log('Patient (Abebe): 0900112233 / password123');
        console.log('-----------------------------------------------');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
    }
};

module.exports = { seedInitialData };
