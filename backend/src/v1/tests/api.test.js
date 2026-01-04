const request = require('supertest');
const app = require('../../app');
const { Article, User } = require('../../models');
const sequelize = require('../../config/database');

describe('Backend Integration Tests', () => {

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('Public API', () => {
        test('GET /v1/public/articles should return all articles', async () => {
            const response = await request(app).get('/v1/public/articles');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        test('GET /v1/public/doctors should return all specialists', async () => {
            const response = await request(app).get('/v1/public/doctors');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            // Ensure private data like passwords aren't leaked
            if (response.body.length > 0) {
                expect(response.body[0]).not.toHaveProperty('password');
            }
        });

        test('GET / should return health check message', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.text).toContain('API (v1) is running');
        });
    });

    describe('Doctor CMS API (Authenticated)', () => {
        let doctorToken;
        let doctorId;

        beforeAll(async () => {
            const jwt = require('jsonwebtoken');
            const doctor = await User.create({
                fullName: 'Dr. Test',
                email: 'doctor@test.com',
                password: 'hashedpassword',
                phone: '0911223344',
                role: 'doctor',
                specialty: 'Cardiology'
            });
            doctorId = doctor.id;
            doctorToken = jwt.sign({ id: doctor.id, role: 'doctor' }, process.env.JWT_SECRET || 'test_secret');
        });

        test('POST /v1/doctor/articles should create an article with valid token', async () => {
            const response = await request(app)
                .post('/v1/doctor/articles')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({
                    titleEn: 'Test Title',
                    titleAm: 'የሙከራ ርዕስ',
                    contentEn: 'Test Content',
                    contentAm: 'የሙከራ ይዘት',
                    image: 'http://example.com/image.jpg'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.titleEn).toBe('Test Title');
            expect(response.body.doctorId).toBe(doctorId);
        });
    });

});
