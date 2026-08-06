import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Otp from '@/models/Otp';
import Partner from '@/models/Partner';

import { sendSmsOtp } from '@/lib/sms';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { phoneNumber } = await req.json();

        if (!phoneNumber) {
            return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
        }

        // Check if partner exists
        const partner = await Partner.findOne({ phoneNumber });
        if (!partner) {
            return NextResponse.json({ success: false, message: 'Account not found. Please register first.' }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Upsert OTP
        await Otp.findOneAndUpdate(
            { phoneNumber },
            { otp: otpValue, expiresAt, verified: false },
            { upsert: true, new: true }
        );

        // Send SMS OTP via SMS Gateway
        await sendSmsOtp(phoneNumber, otpValue);

        return NextResponse.json({ success: true, message: 'OTP sent successfully', otp: otpValue });

    } catch (error) {
        console.error('Login OTP Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
    }
}
