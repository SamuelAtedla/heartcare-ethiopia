const User = require('./User');
const Appointment = require('./Appointment');
const MedicalAttachment = require('./MedicalAttachment');
const Payment = require('./Payment');

// Relationships
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'patientAppointment' });
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

User.hasMany(Appointment, { foreignKey: 'doctorId', as: 'doctorAppointment' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

Appointment.hasOne(Payment, { foreignKey: 'appointmentId' });
Payment.belongsTo(Appointment, { foreignKey: 'appointmentId' });

Appointment.hasMany(MedicalAttachment, { as: 'labResults', foreignKey: 'appointmentId' });
MedicalAttachment.belongsTo(Appointment, { foreignKey: 'appointmentId' });

module.exports = { User, Appointment, Payment };