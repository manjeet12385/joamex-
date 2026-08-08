import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

import { verifyJWT } from '@/backend/services/authService';

export async function GET(req) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized: Admin authentication required' }, { status: 401 });
        }

        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'All Status';

        const query = {};

        // Search Logic
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter Logic
        if (status === 'Verified' || status === 'Active') {
            query.isBlocked = { $ne: true };
        } else if (status === 'Blocked' || status === 'Suspended') {
            query.isBlocked = true;
        }

        // Stats Calculation
        const totalUsers = await User.countDocuments({});

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newJoined = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        const pendingVerification = await User.countDocuments({ isVerified: false });
        const suspendedAccounts = await User.countDocuments({ isBlocked: true });

        // Pagination
        const skip = (page - 1) * limit;
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const Booking = (await import('@/models/Booking')).default;
        const usersWithBookings = await Promise.all(users.map(async (u) => {
            const count = await Booking.countDocuments({
                $or: [
                    { userId: u._id.toString() },
                    { 'userDetails.email': u.email }
                ]
            });
            const userObj = u.toObject();
            userObj.bookings = new Array(count).fill(null); // Set length to match booking count
            return userObj;
        }));

        const totalFiltered = await User.countDocuments(query);
        const totalPages = Math.ceil(totalFiltered / limit);

        return NextResponse.json({
            success: true,
            users: usersWithBookings,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers: totalFiltered,
                perPage: limit
            },
            stats: {
                totalUsers,
                newJoined,
                pendingVerification,
                suspendedAccounts
            }
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
