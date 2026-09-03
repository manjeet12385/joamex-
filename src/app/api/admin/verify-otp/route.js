export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/store';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import EmailOtp from '@/models/EmailOtp';
import { signJWT } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        await connectToDatabase();

        // Try DB first, fallback to memory
        let dbRecord = await EmailOtp.findOne({ email: normalizedEmail });
        const storedData = otpStore.get(normalizedEmail);

        const expectedOtp = dbRecord?.otp || storedData?.otp;
        const expiresAt = dbRecord?.expiresAt ? new Date(dbRecord.expiresAt).getTime() : storedData?.expiresAt;

        console.log("🔍 [OTP VERIFICATION] Verifying for email:", normalizedEmail);
        console.log("🔍 [OTP VERIFICATION] Received OTP:", otp);
        console.log("🔍 [OTP VERIFICATION] Stored OTP:", expectedOtp || "None");

        if (!expectedOtp) {
            return NextResponse.json(
                { error: 'OTP not found. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check expiry
        if (Date.now() > expiresAt) {
            otpStore.delete(normalizedEmail);
            await EmailOtp.deleteOne({ email: normalizedEmail });
            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (expectedOtp !== otp) {
            return NextResponse.json(
                { error: 'Invalid OTP. Please check and try again.' },
                { status: 400 }
            );
        }

        // Success - delete OTP
        otpStore.delete(normalizedEmail);
        await EmailOtp.deleteOne({ email: normalizedEmail });

        // Check if admin exists in DB
        await connectToDatabase();
        let admin = await Admin.findOne({ email: normalizedEmail });

        if (!admin) {
            return NextResponse.json(
                { error: 'Access Denied: Only authorized Admin accounts are permitted.' },
                { status: 403 }
            );
        }

        const token = await signJWT({ email: admin.email, role: 'admin' });

        const response = NextResponse.json(
            {
                message: 'OTP verified successfully',
                success: true,
                user: {
                    fullName: admin.fullName,
                    email: admin.email,
                    phone: admin.phone,
                    profileImage: admin.profileImage
                }
            },
            { status: 200 }
        );

        // Set Secure Cookie (30 Days persistent login)
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30 // 30 days persistent login
        });

        return response;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { error: 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}
