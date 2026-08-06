import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import User from '@/backend/models/User';
import { verifyJWT, signJWT } from '@/backend/services/authService';
import bcrypt from 'bcryptjs';

export async function getMeController(request) {
    try {
        await connectToDatabase();

        const token = request.cookies.get('user_token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = await verifyJWT(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImage: user.profileImage,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('❌ authController.getMe Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error.message
        }, { status: 500 });
    }
}

export async function sendOtpController(req) {
    try {
        await connectToDatabase();
        const { phone } = await req.json();

        if (!phone || phone.length < 10) {
            return NextResponse.json({
                success: false,
                message: 'Valid phone number required'
            }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        let user = await User.findOne({ phone });

        if (!user) {
            user = await User.create({
                phone,
                fullName: `User ${phone.slice(-4)}`,
                email: `${phone}@temp.com`,
                otp,
                otpExpiry,
                isVerified: false
            });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        }

        console.log(`\n🔐 OTP for ${phone}: ${otp}\n`);

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully',
            otp
        });

    } catch (error) {
        console.error('authController.sendOtp Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

export async function verifyOtpController(req) {
    try {
        await connectToDatabase();
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({
                success: false,
                message: 'Phone and OTP required'
            }, { status: 400 });
        }

        const user = await User.findOne({
            phone,
            otp,
            otpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid or expired OTP'
            }, { status: 400 });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: 'user'
        };
        const jwtToken = await signJWT(tokenPayload);

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                profileImage: user.profileImage
            }
        });

        response.cookies.set('user_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });

        return response;

    } catch (error) {
        console.error('authController.verifyOtp Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

export async function logoutController() {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.set('user_token', '', { httpOnly: true, expires: new Date(0) });
    return response;
}
