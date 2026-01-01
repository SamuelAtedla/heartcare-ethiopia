const crypto = require('crypto');
const { Appointment, Payment } = require('../models');

exports.handleChapaWebhook = async (req, res) => {
  // 1. Verify Chapa Hash (Security Guard)
  const hash = crypto
    .createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-chapa-signature']) {
    return res.status(401).send('Invalid Signature');
  }

  const { tx_ref, status } = req.body;

  if (status === 'success') {
    // 2. Find the payment and appointment
    const payment = await Payment.findOne({ where: { tx_ref } });
    
    if (payment) {
      // 3. Update Database to "Confirmed"
      await payment.update({ status: 'success' });
      await Appointment.update(
        { status: 'confirmed' }, 
        { where: { id: payment.appointmentId } }
      );
      
      console.log(`Appointment ${payment.appointmentId} is now CONFIRMED.`);
    }
  }

  res.status(200).send('Webhook Received');
};