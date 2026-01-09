const { Availability } = require('../models');
const appointmentController = require('../v1/controllers/appointmentController');
const moment = require('moment');

// Mock request and response
const mockRes = () => {
    const res = {};
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.body = data; return res; };
    return res;
};

async function testSlotGeneration() {
    console.log('--- Testing Slot Generation ---');

    // 1. Setup mock doctor and availability
    const doctorId = 'test-doctor-uuid';
    const date = '2026-01-12'; // A Monday
    const dayOfWeek = 1; // Monday

    // Clean up any existing test data (if possible/needed in a real test environment)
    // Here we just manually call the logic or mock the DB calls if we were using a real test framework.
    // For this quick verification, let's assume the DB is accessible.

    try {
        // Ensure we have availability for Monday 10:00 - 12:00 with 30 min slots
        await Availability.destroy({ where: { doctorId, dayOfWeek } });
        await Availability.create({
            doctorId,
            dayOfWeek,
            startTime: '10:00',
            endTime: '12:00',
            slotDuration: 30,
            isActive: true
        });

        const req = {
            query: { doctorId, date }
        };
        const res = mockRes();

        await appointmentController.getAvailableSlots(req, res);

        console.log('Generated Slots:', res.body.availableSlots);

        const expectedSlots = [
            moment(date).set({ hour: 10, minute: 0, second: 0 }).format(),
            moment(date).set({ hour: 10, minute: 30, second: 0 }).format(),
            moment(date).set({ hour: 11, minute: 0, second: 0 }).format(),
            moment(date).set({ hour: 11, minute: 30, second: 0 }).format(),
        ];

        const allMatch = expectedSlots.every(slot => res.body.availableSlots.includes(slot)) &&
            expectedSlots.length === res.body.availableSlots.length;

        if (allMatch) {
            console.log('✅ Success: Slots match expected availability.');
        } else {
            console.log('❌ Failure: Slots do not match expected availability.');
        }

    } catch (error) {
        console.error('Verification Test Error:', error);
    }
}

// Note: This script is intended to be run in the backend context.
// For now, I'll just verify the code manually and provide a walkthrough.
// Since I cannot easily run a script that requires the full database setup without affecting state,
// I will rely on the logic check and the user's manual verification.
