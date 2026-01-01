import { Appointment, User } from '../models';

exports.getConfirmedQueue = async (req, res) => {
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

exports.saveNote = async (req, res) => {
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

exports.getPatientDetails = async (req, res) => {
  const details = await Appointment.findByPk(req.params.id, {
    include: [
      { model: MedicalAttachment, as: 'labResults' },
      { model: User, as: 'patient', attributes: ['fullName', 'phone'] }
    ]
  });
  res.json(details);
};