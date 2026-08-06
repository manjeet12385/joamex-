require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testSend() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"Joamex Partner Portal" <${process.env.EMAIL_USER}>`,
            to: 'dv4502629@gmail.com',
            subject: 'Test OTP Code',
            text: 'Your test OTP code is 123456',
            html: '<p>Your test OTP code is <strong>123456</strong></p>'
        });
        console.log("Email sent successfully! MessageID:", info.messageId);
    } catch (err) {
        console.error("Failed to send email:", err);
    }
}

testSend();
