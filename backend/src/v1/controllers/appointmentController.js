//appointmentController.js
//Note: MISSING CHAPA INTEGRATION PARTS
//const axios = require('axios');
//const { v4: uuidv4 } = require('uuid');

const { Appointment, User, MedicalAttachment, Payment } = require('../../models');
const { Op } = require('sequelize');
const moment = require('moment'); // Use moment for easier time manipulation

const appointmentController = {
  // 1. PUBLIC: Fetch available time slots
  getAvailableSlots: async (req, res) => {
    try {
      const { date, doctorId } = req.query;
      console.log(`Checking availability for Doctor ${doctorId} on ${date}`);
      const slotDuration = 30; // 30-minute intervals

      const confirmedAppts = await Appointment.findAll({
        where: {
          doctorId,
          status: { [Op.or]: ['confirmed'] }, // Can add 'pending_approval' if we want to block those too
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

      console.log(`Available slots calculated: ${availableSlots.length}`);
      res.json({ date, availableSlots });
    } catch (error) {
      console.error("Availability Error:", error);
      res.status(500).json({ error: 'Failed to load availability.' });
    }
  },

  // 8. DOCTOR/ADMIN: Approve Payment
  approvePayment: async (req, res) => {
    try {
      const { appointmentId } = req.body;
      console.log(`Payment Approval Request for Appt: ${appointmentId} by User ${req.user.id}`);
      // Security: In real app, check if req.user is admin or the doctor

      await Appointment.update(
        { status: 'confirmed' },
        { where: { id: appointmentId } }
      );

      // Also update Payment status if we had a link, but Appointment status is key

      console.log(`Appointment ${appointmentId} confirmed successfully.`);
      res.json({ message: 'Appointment approved successfully.' });
    } catch (error) {
      console.error("Payment Approval Error:", error);
      res.status(500).json({ error: 'Approval failed.' });
    }
  },

  // 2. PATIENT: Create pending booking
  createPendingAppointment: async (req, res) => {
    try {
      const { doctorId, scheduledAt, clinicalNotes, communicationMode, patientPhone } = req.body;
      console.log(`Booking attempt: Patient ${req.user.id} -> Doctor ${doctorId} @ ${scheduledAt}`);

      // Check for conflicts
      const conflict = await Appointment.findOne({
        where: { doctorId, scheduledAt, status: 'confirmed' }
      });

      if (conflict) {
        console.log(`Booking conflict for ${scheduledAt}`);
        return res.status(400).json({ error: 'Slot is no longer available.' });
      }

      const appointment = await Appointment.create({
        patientId: req.user.id,
        patientPhone: patientPhone || req.user.phone, // Use provided or default from session
        communicationMode: communicationMode || 'whatsapp',
        doctorId,
        scheduledAt,
        clinicalNotes, // Initial reason
        status: 'pending_payment'
      });

      console.log(`Appointment Created (Pending Payment): ${appointment.id}`);
      res.status(201).json({ appointmentId: appointment.id });
    } catch (error) {
      console.error("Booking Error:", error);
      res.status(500).json({ error: 'Booking process failed.' });
    }
  },

  // 3. PATIENT: Upload Payment Receipt
  uploadPaymentReceipt: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      console.log(`Payment Receipt Upload for Appointment: ${appointmentId}`);

      if (!req.file) {
        return res.status(400).json({ error: 'No receipt file provided.' });
      }

      // 1. Find the appointment
      const appointment = await Appointment.findOne({
        where: { id: appointmentId, patientId: req.user.id }
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      // 2. Create Payment Record (Receipt Based)
      await Payment.create({
        appointmentId: appointment.id,
        amount: 500, // Fixed fee for now
        status: 'pending_verification',
        tx_ref: 'RECEIPT-' + Date.now(), // Mock TX Ref
      });

      // 3. Update Appointment Status
      // We store the receipt path in clinical notes for now strictly based on current DB schema limitation, 
      // OR ideally we should have a 'receiptPath' in Payment model. 
      // For this task, we'll assume Payment model doesn't strictly track file path, so we might need to add it 
      // or just link it via a MedicalAttachment if we want to be clean.
      // Let's use MedicalAttachment for simplicity as 'receipt'.

      await MedicalAttachment.create({
        appointmentId: appointment.id,
        fileName: 'Payment Receipt',
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      });

      await appointment.update({ status: 'pending_approval' });

      console.log(`Receipt uploaded and status updated to pending_approval for Appt ${appointment.id}`);
      res.status(200).json({ message: 'Receipt uploaded. Waiting for approval.' });

    } catch (error) {
      console.error("Receipt Upload Error:", error);
      res.status(500).json({ error: 'Failed to upload receipt.' });
    }
  },

  // 4. PATIENT: Upload Lab Results
  uploadLabResults: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      console.log(`Lab Results Upload for Appointment: ${appointmentId}`);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files provided.' });
      }

      const fileRecords = req.files.map(file => ({
        appointmentId,
        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size
      }));

      await MedicalAttachment.bulkCreate(fileRecords);

      console.log(`${req.files.length} lab files saved.`);
      res.status(200).json({ message: 'Lab results uploaded successfully.' });
    } catch (error) {
      console.error("Lab Upload Error:", error);
      res.status(500).json({ error: 'File upload failed.' });
    }
  },

  // 5. PATIENT: View History
  getPatientHistory: async (req, res) => {
    try {
      const history = await Appointment.findAll({
        where: { patientId: req.user.id },
        include: [
          { model: User, as: 'doctor', attributes: ['fullName', 'specialty'] },
          { model: MedicalAttachment, as: 'labResults' }
        ],
        order: [['scheduledAt', 'DESC']]
      });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching history.' });
    }
  },

  // 6. DOCTOR: Add Notes
  addClinicalNotes: async (req, res) => {
    try {
      const { appointmentId, notes } = req.body;
      const appt = await Appointment.findByPk(appointmentId);

      if (appt.doctorId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized.' });
      }

      await appt.update({
        clinicalNotes: notes,
        status: 'completed'
      });

      res.json({ message: 'Record updated.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save clinical notes.' });
    }
  },

  // 7. DOCTOR: Get Queue (Updated to show pending approvals)
  getDoctorQueue: async (req, res) => {
    try {
      const startOfToday = moment().startOf('day').toDate();
      const endOfToday = moment().endOf('day').toDate();

      const queue = await Appointment.findAll({
        where: {
          doctorId: req.user.id,
          // Show both confirmed and those waiting for payment approval
          status: { [Op.or]: ['confirmed', 'pending_approval'] },
          scheduledAt: {
            [Op.between]: [startOfToday, endOfToday]
          }
        },
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['fullName', 'phone', 'age', 'profileImage']
          },
          {
            model: MedicalAttachment,
            as: 'labResults'
          }
        ],
        order: [['scheduledAt', 'ASC']]
      });

      res.status(200).json(queue);
    } catch (error) {
      console.error("Queue Error:", error);
      res.status(500).json({ error: 'Could not retrieve queue.' });
    }
  },

  // 8. DOCTOR/ADMIN: Approve Payment
  approvePayment: async (req, res) => {
    try {
      const { appointmentId } = req.body;
      console.log(`Payment Approval Request for Appt: ${appointmentId} by User ${req.user.id}`);
      // Security: In real app, check if req.user is admin or the doctor

      await Appointment.update(
        { status: 'confirmed' },
        { where: { id: appointmentId } }
      );

      // Also update Payment status if we had a link, but Appointment status is key

      console.log(`Appointment ${appointmentId} confirmed successfully.`);
      res.json({ message: 'Appointment approved successfully.' });
    } catch (error) {
      console.error("Payment Approval Error:", error);
      res.status(500).json({ error: 'Approval failed.' });
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