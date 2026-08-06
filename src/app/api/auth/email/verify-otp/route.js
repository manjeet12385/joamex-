import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import EmailOtp from '@/models/EmailOtp';
import Partner from '@/models/Partner';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, otp, type } = await req.json(); // type: 'login' or 'register'

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
        }

        const record = await EmailOtp.findOne({ email });

        if (!record) {
            return NextResponse.json({ success: false, message: 'OTP not found or expired' }, { status: 400 });
        }

        if (record.otp !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        if (new Date() > record.expiresAt) {
            return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
        }

        // --- OTP Verified ---

        // If Type is Login -> Issue Token
        if (type === 'login') {
            const partner = await Partner.findOne({ email });
            if (partner) {
                // LOGIN SUCCESS: Issue Token
                const token = await signJWT({
                    id: partner._id.toString(),
                    role: 'partner',
                    email: partner.email
                });

                // Set Cookie
                (await cookies()).set('partner_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                });

                // Cleanup OTP
                await EmailOtp.deleteOne({ email });

                return NextResponse.json({ success: true, message: 'Login successful', action: 'login' });
            } else {
                return NextResponse.json({ success: false, message: 'Partner account not found' }, { status: 404 });
            }
        }

        // Registration Verification
        record.verified = true;
        await record.save();

        return NextResponse.json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
