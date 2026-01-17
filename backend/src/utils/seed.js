const { User, Appointment, Article, Availability } = require('../models');
const bcrypt = require('bcryptjs');

const seedInitialData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

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
            if (created) {
                console.log(`✅ Doctor ${dr.fullName} seeded.`);
            }
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
            }
        ];

        const createdPatients = [];
        for (const pt of patientsData) {
            const [user, created] = await User.findOrCreate({
                where: { phone: pt.phone },
                defaults: pt
            });
            if (created) {
                console.log(`✅ Patient ${pt.fullName} seeded.`);
            }
            createdPatients.push(user);
        }

        // 3. Seed Availabilities (for Dr. Yebeltal)
        const yebeltal = createdDoctors.find(d => d.phone === '0911728203');
        if (yebeltal) {
            const days = [1, 2, 3, 4, 5]; // Mon to Fri
            for (const day of days) {
                await Availability.findOrCreate({
                    where: { doctorId: yebeltal.id, dayOfWeek: day },
                    defaults: {
                        doctorId: yebeltal.id,
                        dayOfWeek: day,
                        startTime: '09:00',
                        endTime: '17:00',
                        slotDuration: 30
                    }
                });
            }
            console.log(`✅ Availabilities for Dr. Yebeltal seeded.`);
        }

        // 4. Seed Articles
        const articlesData = [
            {
                titleEn: "Understanding Hypertension",
                titleAm: "የደም ግፊትን መረዳት",
                contentEn: "Hypertension, also known as high blood pressure, is a condition in which the force of the blood against the artery walls is too high.",
                contentAm: "የደም ግፊት (Hypertension) ማለት ደም በደም ቅዳ ግድግዳዎች ላይ የሚያሳርፈው ግፊት ከተለመደው በላይ የሚሆንበት ሁኔታ ነው።",
                image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000",
                doctorId: yebeltal ? yebeltal.id : null
            },
            {
                titleEn: "Heart Healthy Lifestyle",
                titleAm: "ለልብ ጤና የሚጠቅም የአኗኗር ዘይቤ",
                contentEn: "A healthy diet and regular exercise are key to maintaining a healthy heart.",
                contentAm: "ጤናማ አመጋገብ እና መደበኛ የአካል ብቃት እንቅስቃሴ ለልብ ጤና ቁልፍ ናቸው።",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000",
                doctorId: creationDoctors[1] ? createdDoctors[1].id : (yebeltal ? yebeltal.id : null)
            }
        ];

        // Minor fix in above logic: createdDoctors[1] instead of creationDoctors[1]
        articlesData[1].doctorId = createdDoctors[1] ? createdDoctors[1].id : (yebeltal ? yebeltal.id : null);

        for (const art of articlesData) {
            const [article, created] = await Article.findOrCreate({
                where: { titleEn: art.titleEn },
                defaults: art
            });
            if (created) {
                console.log(`✅ Article "${art.titleEn}" seeded.`);
            }
        }

        // 5. Seed Appointments
        if (yebeltal && createdPatients.length > 0) {
            const appointmentsData = [
                {
                    patientId: createdPatients[0].id,
                    doctorId: yebeltal.id,
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
                    doctorId: yebeltal.id,
                    patientPhone: createdPatients[1].phone,
                    communicationMode: 'whatsapp',
                    scheduledAt: new Date(Date.now() + 172800000), // Day after tomorrow
                    status: 'confirmed',
                    symptoms: "Follow up after medication change.",
                    paymentReference: "PAY-EXAMPLE-002"
                }
            ];

            // Fix status typo if necessary (model says 'confirmed' is one of the ENUM values)
            appointmentsData[1].status = 'confirmed';

            for (const appt of appointmentsData) {
                // We use findOrCreate carefully here. Maybe check by patientId and scheduledAt
                const [appointment, created] = await Appointment.findOrCreate({
                    where: {
                        patientId: appt.patientId,
                        doctorId: appt.doctorId,
                        scheduledAt: appt.scheduledAt
                    },
                    defaults: appt
                });
                if (created) {
                    console.log(`✅ Appointment for ${createdPatients.find(p => p.id === appt.patientId).fullName} seeded.`);
                }
            }
        }

        console.log('🚀 Database seeding completed successfully.');
        console.log('-----------------------------------------------');
        console.log('Sample Logins:');
        console.log('Doctor: 0911728203 / password123');
        console.log('Patient: 0900112233 / password123');
        console.log('-----------------------------------------------');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
    }
};

module.exports = { seedInitialData };
