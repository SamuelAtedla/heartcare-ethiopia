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

const updateProfile = async (req, res) => {
  try {
    const { fullName, age, phone, email } = req.body;
    console.log(`Updating Profile for Patient: ${req.user.id}`);

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (age !== undefined) updateData.age = age;
    if (email !== undefined) updateData.email = email;

    // Guard phone similarly to doctor controller
    if (phone && phone !== '' && phone !== 'undefined') {
      updateData.phone = phone;
    }

    await User.update(
      updateData,
      { where: { id: req.user.id } }
    );

    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error("Patient Profile Update Error:", error);
    res.status(500).json({ error: 'Profile update failed.' });
  }
};

module.exports = {
  getPatientHistory,
  updateProfile
};