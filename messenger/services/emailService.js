const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com', 
        pass: 'your_email_password'  
    }
});

exports.sendVerificationEmail = (email, verificationLink) => {
    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    };

    return transporter.sendMail(mailOptions);
};