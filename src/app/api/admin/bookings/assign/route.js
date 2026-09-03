export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import Partner from '@/models/Partner';
import { verifyJWT } from '@/backend/services/authService';

export async function POST(req) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized: Admin authentication required' }, { status: 401 });
        }

        await connectToDatabase();
        const { bookingId, partnerId } = await req.json();

        if (!bookingId || !partnerId) {
            return NextResponse.json({ success: false, message: 'Booking ID and Partner ID are required' }, { status: 400 });
        }

        const partner = await Partner.findById(partnerId);
        if (!partner) {
            return NextResponse.json({ success: false, message: 'Partner not found' }, { status: 404 });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                partnerId: partner._id,
                partner: {
                    id: partner._id,
                    name: partner.fullName,
                    phone: partner.phoneNumber,
                    email: partner.email
                },
                status: 'Assigned'
            },
            { new: true }
        );

        if (!updatedBooking) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Booking assigned to partner ${partner.fullName}`,
            booking: updatedBooking
        });

    } catch (error) {
        console.error('Assign Partner Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
