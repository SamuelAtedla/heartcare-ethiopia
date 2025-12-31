const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res) => {
  try {
    const { date, phone } = req.body;
    
    // 1. Create pending record
    const appointment = await Appointment.create({
      patientPhone: phone,
      scheduledAt: date,
      status: 'pending_payment'
    });

    // 2. Generate Payment Link (Logic for Chapa/Telebirr would go here)
    const paymentUrl = `https://checkout.chapa.co/pay/test-${appointment.id}`;

    res.status(201).json({ paymentUrl, appointmentId: appointment.id });
  } catch (error) {
    res.status(500).json({ error: "System error during booking." });
  }
};