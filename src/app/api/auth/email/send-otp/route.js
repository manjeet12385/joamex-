import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import EmailOtp from '@/models/EmailOtp';
import { sendEmail } from '@/lib/email';
import Partner from '@/models/Partner';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, type } = await req.json(); // type: 'register' or 'login'

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        // Check existence based on type
        const existingPartner = await Partner.findOne({ email });
        if (type === 'register' && existingPartner) {
            return NextResponse.json({ success: false, message: 'Email is already registered. Please login.' }, { status: 400 });
        }
        if (type === 'login' && !existingPartner) {
            return NextResponse.json({ success: false, message: 'Email not found. Please register.' }, { status: 404 });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 mins

        // Save to DB
        await EmailOtp.findOneAndUpdate(
            { email },
            { otp, expiresAt, verified: false },
            { upsert: true, new: true }
        );

        // Send Email
        const subject = 'Your Joamex Partner Verification Code';
        const text = `Your verification code is ${otp}. It expires in 60 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #2563eb; text-align: center;">Joamex Partner Verification</h2>
                <p>Hello,</p>
                <p>Your one-time verification code (OTP) for your Joamex Partner account is:</p>
                <div style="text-align: center; margin: 25px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e293b; background: #f1f5f9; padding: 12px 24px; border-radius: 8px; border: 1px solid #cbd5e1;">${otp}</span>
                </div>
                <p>This code is valid for 60 minutes. Do not share this code with anyone.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #64748b; text-align: center;">Joamex Home Services &bull; Partner Portal</p>
            </div>
        `;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const emailResult = await sendEmail(email, subject, text, html);
            if (!emailResult.success) {
                console.error("Email send failed:", emailResult.error);
            }
        } else {
            console.log(`[Mock Email] To: ${email}, OTP: ${otp}`);
        }

        return NextResponse.json({ 
            success: true, 
            message: 'OTP sent to email',
            otp: otp
        });

    } catch (error) {
        console.error('Send Email OTP Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
