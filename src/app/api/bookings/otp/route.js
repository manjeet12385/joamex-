export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import Booking from '@/backend/models/Booking';
import { verifyJWT } from '@/backend/services/authService';

export async function POST(request) {
    try {
        await connectToDatabase();
        
        const token = request.cookies.get('partner_token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        
        const decoded = await verifyJWT(token);
        if (!decoded || decoded.role !== 'partner') {
            return NextResponse.json({ success: false, message: 'Invalid Token or Role' }, { status: 403 });
        }

        const body = await request.json();
        const { bookingId, type, otp } = body; // type is 'start' or 'end'

        if (!bookingId || !type || !otp) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        if (booking.partner?.id?.toString() !== decoded.id) {
            return NextResponse.json({ success: false, message: 'Not authorized for this booking' }, { status: 403 });
        }

        if (type === 'start') {
            if (booking.jobStartOtp !== otp) {
                return NextResponse.json({ success: false, message: 'Invalid Start OTP' }, { status: 400 });
            }
            booking.status = 'In-Progress';
            booking.trackingStatus = 'Started';
            await booking.save();
            return NextResponse.json({ success: true, message: 'Job Started successfully' });
        } 
        
        if (type === 'end') {
            if (booking.jobEndOtp !== otp) {
                return NextResponse.json({ success: false, message: 'Invalid End OTP' }, { status: 400 });
            }
            // Will let the complete endpoint handle the revenue split, this just verifies OTP
            return NextResponse.json({ success: true, message: 'End OTP verified. You can now complete the job.' });
        }

        return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });

    } catch (error) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
