const { Appointment, User } = require('../../models/index');

const getPatientHistory = async (req, res) => {
  try {
    const history = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [{ model: User, as: 'doctor', attributes: ['fullName'] }],
      order: [['scheduledAt', 'DESC']]
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch history' });
  }
};

module.exports = {
  getPatientHistory
};