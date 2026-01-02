//appointmentController.js
//Note: MISSING CHAPA INTEGRATION PARTS
//const axios = require('axios');
//const { v4: uuidv4 } = require('uuid');

const { Appointment, User, MedicalAttachment, Payment } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment'); // Use moment for easier time manipulation

const appointmentController = {
  // 1. PUBLIC: Fetch available time slots
  getAvailableSlots: async (req, res) => {
    try {
      const { date, doctorId } = req.query; 
      const slotDuration = 30; // 30-minute intervals

      const confirmedAppts = await Appointment.findAll({
        where: {
          doctorId,
          status: 'confirmed',
          scheduledAt: {
            [Op.between]: [
              moment(date).startOf('day').toDate(),
              moment(date).endOf('day').toDate()
            ]
          }
        }
      });

      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM
      let availableSlots = [];

      for (let hr = startHour; hr < endHour; hr++) {
        for (let min = 0; min < 60; min += slotDuration) {
          const slot = moment(date).hour(hr).minute(min).second(0);
          const isTaken = confirmedAppts.some(a => moment(a.scheduledAt).isSame(slot));
          if (!isTaken) availableSlots.push(slot.format());
        }
      }

      res.json({ date, availableSlots });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load availability.' });
    }
  },

  // 2. PATIENT: Create pending booking and save metadata
  createPendingAppointment: async (req, res) => {
    try {
      const { doctorId, scheduledAt, clinicalNotes } = req.body;

      // Check if someone else just took the slot
      const conflict = await Appointment.findOne({
        where: { doctorId, scheduledAt, status: 'confirmed' }
      });

      if (conflict) return res.status(400).json({ error: 'Slot is no longer available.' });

      const appointment = await Appointment.create({
        patientId: req.user.id,
        doctorId,
        scheduledAt,
        clinicalNotes, // Initial reason for visit
        status: 'pending_payment'
      });

      res.status(201).json({ appointmentId: appointment.id });
    } catch (error) {
      res.status(500).json({ error: 'Booking process failed.' });
    }
  },

  // 3. PATIENT: Upload multiple lab results (metadata & file paths)
  uploadLabResults: async (req, res) => {
    try {
      const { appointmentId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files provided.' });
      }

      // Create multiple entries in MedicalAttachments table
      const fileRecords = req.files.map(file => ({
        appointmentId,
        fileName: file.originalname,
        filePath: file.path, // Secure path outside web root
        fileType: file.mimetype,
        fileSize: file.size
      }));

      await MedicalAttachment.bulkCreate(fileRecords);

      res.status(200).json({ message: 'Lab results uploaded successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'File upload failed.' });
    }
  },

  // 4. PATIENT: View personal history
  getPatientHistory: async (req, res) => {
    try {
      const history = await Appointment.findAll({
        where: { patientId: req.user.id },
        include: [
          { model: User, as: 'doctor', attributes: ['fullName'] },
          { model: MedicalAttachment, as: 'labResults' }
        ],
        order: [['scheduledAt', 'DESC']]
      });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching history.' });
    }
  },

  // 5. DOCTOR: Save clinical findings after session
  addClinicalNotes: async (req, res) => {
    try {
      const { appointmentId, notes } = req.body;
      const appt = await Appointment.findByPk(appointmentId);

      // Verify doctor ownership
      if (appt.doctorId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized.' });
      }

      await appt.update({ 
        clinicalNotes: notes, 
        status: 'completed' 
      });

      res.json({ message: 'Record updated and consultation finalized.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save clinical notes.' });
    }
  },
  getDoctorQueue : async (req, res) => {
  try {
    // 1. Define the time window (Today)
    const startOfToday = moment().startOf('day').toDate();
    const endOfToday = moment().endOf('day').toDate();

    // 2. Query the database
    const queue = await Appointment.findAll({
      where: {
        doctorId: req.user.id, // Securely identified from JWT
        status: 'confirmed',   // Only show paid/confirmed visits
        scheduledAt: {
          [Op.between]: [startOfToday, endOfToday] // Only today's queue
        }
      },
      // 3. Include related data so the doctor sees WHO they are meeting
      include: [
        { 
          model: User, 
          as: 'patient', 
          attributes: ['fullName', 'phone'] // Don't send sensitive passwords/hashes
        },
        { 
          model: MedicalAttachment, 
          as: 'labResults',
          attributes: ['id', 'fileName'] // Show list of files available to view
        }
      ],
      // 4. Sort by time so the next patient is at the top
      order: [['scheduledAt', 'ASC']]
    });

    res.status(200).json(queue);
  } catch (error) {
    console.error("Queue Error:", error);
    res.status(500).json({ error: 'Could not retrieve today\'s queue.' });
  }
}
};

module.exports = appointmentController;
/*======FIRST example function=======
exports.createBooking = async (req, res) => {
  try {
    const { scheduledAt, amount } = req.body;
    const tx_ref = `heart-care-${uuidv4()}`; // Unique reference for Chapa

    // 1. Create a "Pending" Appointment
    const appointment = await Appointment.create({
      patientId: req.user.id, // From JWT middleware
      scheduledAt,
      status: 'pending_payment'
    });

    // 2. Initialize Chapa Transaction
    const chapaResponse = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount: amount,
        currency: 'ETB',
        email: req.user.email,
        first_name: req.user.fullName.split(' ')[0],
        tx_ref: tx_ref,
        callback_url: `${process.env.BASE_URL}/api/webhooks/chapa`,
        return_url: `${process.env.FRONTEND_URL}/dashboard/success`,
      },
      { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
    );

    // 3. Save Payment Record
    await Payment.create({
      tx_ref: tx_ref,
      amount: amount,
      appointmentId: appointment.id,
      status: 'initiated'
    });

    res.json({ checkout_url: chapaResponse.data.data.checkout_url });
  } catch (error) {
    res.status(500).json({ error: 'Booking failed. Try again.' });
  }
};


exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, doctorId } = req.query; // e.g., 2024-06-01
    const slotDuration = 30; // 30-minute sessions

    // 1. Fetch all confirmed appointment for this doctor on this day
    const appointment = await Appointment.findAll({
      where: {
        doctorId,
        status: 'confirmed',
        scheduledAt: {
          [Op.between]: [
            moment(date).startOf('day').toDate(),
            moment(date).endOf('day').toDate()
          ]
        }
      }
    });

    // 2. Define Working Hours (could eventually be stored in Doctor profile)
    const startHour = 9; // 09:00 AM
    const endHour = 17;  // 05:00 PM
    let slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += slotDuration) {
        const slotTime = moment(date).hour(hour).minute(min).second(0);
        
        // Check if this slot conflicts with an existing appointment
        const isTaken = appointment.some(appt => 
          moment(appt.scheduledAt).isSame(slotTime)
        );

        if (!isTaken) slots.push(slotTime.format());
      }
    }

    res.json({ date, slots });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating availability' });
  }
};

exports.createPendingAppointment = async (req, res) => {
  try {
    const { doctorId, scheduledAt, patientNote } = req.body;

    // 1. Double-check if the slot is still free (Concurrency Protection)
    const existing = await Appointment.findOne({
      where: { doctorId, scheduledAt, status: 'confirmed' }
    });

    if (existing) return res.status(400).json({ error: 'Slot was just taken' });

    // 2. Create the record
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      scheduledAt,
      status: 'pending_payment',
      clinicalNotes: patientNote // Initially stores patient's reason for visit
    });

    res.status(201).json({ 
      message: 'Appointment reserved. Please proceed to payment.',
      appointmentId: appointment.id 
    });
  } catch (error) {
    res.status(500).json({ error: 'Booking system error' });
  }
};

exports.uploadLabResults = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // 1. Check if files were actually uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files selected for upload.' });
    }

    // 2. Map through files and create DB records
    const attachmentPromises = req.files.map(file => {
      return MedicalAttachment.create({
        appointmentId: appointmentId,
        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size
      });
    });

    await Promise.all(attachmentPromises);

    res.status(200).json({ 
      message: `${req.files.length} lab results uploaded successfully.` 
    });
  } catch (error) {
    res.status(500).json({ error: 'File upload system error.' });
  }
};

*/