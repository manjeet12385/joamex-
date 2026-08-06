import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';
import User from '@/models/User';
import Booking from '@/models/Booking';

export async function GET(req) {
    try {
        await connectToDatabase();

        // Database Queries
        const [totalPartners, verifiedPartners, totalUsers, totalBookings] = await Promise.all([
            Partner.countDocuments({}),
            Partner.countDocuments({ status: 'Verified' }),
            User.countDocuments({}),
            Booking.countDocuments({})
        ]);

        // Calculate Revenue from Completed Bookings
        const revenueResult = await Booking.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        return NextResponse.json({
            success: true,
            stats: {
                totalPartners,
                verifiedPartners,
                totalUsers,
                revenue: totalRevenue,
                bookings: totalBookings
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
    }
}
