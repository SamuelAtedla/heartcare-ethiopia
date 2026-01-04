const { Appointment, User, MedicalAttachment } = require('../../models/index');
const { Op } = require('sequelize');
const moment = require('moment'); // Ensure moment is available if used

const getConfirmedQueue = async (req, res) => {
  try {
    const queue = await Appointment.findAll({
      where: {
        status: 'confirmed',
        doctorId: req.user.id
      },
      include: [{ model: User, as: 'patient', attributes: ['fullName', 'phone'] }],
      order: [['scheduledAt', 'ASC']]
    });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch queue.' });
  }
};

const saveNote = async (req, res) => {
  try {
    const { appointmentId, notes } = req.body;

    const appt = await Appointment.findByPk(appointmentId);

    // Security: Ensure the doctor owns this appointment
    if (appt.doctorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to record' });
    }

    await appt.update({
      clinicalNotes: notes,
      status: 'completed'
    });

    res.json({ message: 'Clinical notes saved and session closed.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save notes' });
  }
};

const getPatientDetails = async (req, res) => {
  const details = await Appointment.findByPk(req.params.id, {
    include: [
      { model: MedicalAttachment, as: 'labResults' },
      { model: User, as: 'patient', attributes: ['fullName', 'phone'] }
    ]
  });
  res.json(details);
};

const getDailySchedule = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    const schedule = await Appointment.findAll({
      where: {
        doctorId,
        status: 'confirmed', // Only show paid/confirmed appointments
        scheduledAt: {
          [Op.between]: [todayStart, todayEnd]
        }
      },
      include: [
        { model: User, as: 'patient', attributes: ['fullName', 'phone'] }
      ],
      attributes: ['id', 'scheduledAt', 'caseType', 'preferredChannel'],
      order: [['scheduledAt', 'ASC']]
    });

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve daily schedule.' });
  }
};

const getDetailedHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const history = await Appointment.findAll({
      where: { patientId },
      include: [
        { model: MedicalAttachment, as: 'labResults' },
        { model: User, as: 'doctor', attributes: ['fullName'] } // See which specialists they saw before
      ],
      attributes: ['id', 'scheduledAt', 'caseType', 'clinicalNotes', 'status'],
      order: [['scheduledAt', 'DESC']] // Newest records first
    });

    if (!history.length) {
      return res.status(404).json({ message: 'No medical history found for this patient.' });
    }

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient medical history.' });
  }
};

module.exports = {
  getConfirmedQueue,
  saveNote,
  getPatientDetails,
  getDailySchedule,
  getDetailedHistory
};