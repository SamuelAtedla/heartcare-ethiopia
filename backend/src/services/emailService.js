const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `Heart Care Ethiopia <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            // html: options.html, // Can be used later for styled emails
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        throw new Error('There was an error sending the email. Try again later!');
    }
};

module.exports = { sendEmail };
