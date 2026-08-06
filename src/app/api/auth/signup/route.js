import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { fullName, email, phone, referralCode } = await req.json();

        // Basic validation
        if (!fullName || !email || !phone) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }

        // Generate a referral code for this user
        const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const user = await User.create({
            fullName,
            email,
            phone,
            referralCode: userReferralCode,
            referralCodeUsed: referralCode || null,
            isVerified: false
        });

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
