const { Appointment, User, MedicalAttachment } = require('../../models/index');
const { Op } = require('sequelize');
const moment = require('moment');

// 1. Get Schedule (Confirmed & Pending Payment Approval)
const getConfirmedQueue = async (req, res) => {
  try {
    const queue = await Appointment.findAll({
      where: {
        doctorId: req.user.id,
        status: { [Op.or]: ['confirmed', 'pending_approval'] }
      },
      include: [{ model: User, as: 'patient', attributes: ['fullName', 'phone', 'profileImage', 'age'] }],
      order: [['scheduledAt', 'ASC']]
    });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch queue.' });
  }
};

// 2. Search Patients (by Name or Phone)
const searchPatients = async (req, res) => {
  try {
    const { query } = req.query; // ?query=Abebe

    if (!query) return res.json([]);

    const patients = await User.findAll({
      where: {
        role: 'patient',
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${query}%` } },
          { phone: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'fullName', 'phone', 'profileImage', 'age']
    });

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Search failed.' });
  }
};

// 3. Get Patient History (Read-only for doctor)
const getDetailedHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const history = await Appointment.findAll({
      where: { patientId },
      include: [
        { model: MedicalAttachment, as: 'labResults' },
        { model: User, as: 'doctor', attributes: ['fullName'] }
      ],
      order: [['scheduledAt', 'DESC']]
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient medical history.' });
  }
};

// 4. Update Doctor Profile
const updateProfile = async (req, res) => {
  try {
    const { bio, specialty, credentials } = req.body;

    await User.update(
      { bio, specialty, credentials },
      { where: { id: req.user.id } }
    );

    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed.' });
  }
};

module.exports = {
  getConfirmedQueue,
  searchPatients,
  getDetailedHistory,
  updateProfile
};