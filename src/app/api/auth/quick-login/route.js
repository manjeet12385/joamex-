export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, fullName, phone } = await req.json();

        if (!email) {
            return NextResponse.json({
                success: false,
                message: 'Email is required'
            }, { status: 400 });
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                email,
                fullName: fullName || `User ${email.split('@')[0]}`,
                phone: phone || '',
                isVerified: true, // Auto-verify for simplicity
                profileImage: ''
            });
        }

        // Generate JWT Token to support middleware authentication
        const { signJWT } = require('@/lib/auth');
        const token = await signJWT({
            id: user._id,
            email: user.email
        });

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                profileImage: user.profileImage || ''
            }
        });

        // Set the user_token cookie
        response.cookies.set('user_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Quick login error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}
