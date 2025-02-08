const nodemailer = require('nodemailer');
const crypto = require('crypto');

const sendVerificationEmail = async (userEmail) => {
    const verificationCode = crypto.randomBytes(20).toString('hex');
    const confirmationLink = `http://наш_сайт.ком/auth/confirm?email=${userEmail}&code=${verificationCode}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_password',
        },
    });

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: userEmail,
        subject: 'Email Verification',
        html: `<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, verificationCode };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
};

module.exports = sendVerificationEmail;
