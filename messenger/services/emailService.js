require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});

exports.sendVerificationEmail = (email, verificationLink) => {
    const mailOptions = {
        from: 'web589972@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    };

    return transporter.sendMail(mailOptions);
};