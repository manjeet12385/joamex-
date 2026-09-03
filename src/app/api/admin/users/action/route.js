export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyJWT } from '@/backend/services/authService';

export async function POST(req) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized: Admin authentication required' }, { status: 401 });
        }

        await connectToDatabase();
        const { userId, action } = await req.json(); // action: 'block' or 'unblock'

        if (!userId || !action) {
            return NextResponse.json({ success: false, message: 'User ID and action are required' }, { status: 400 });
        }

        const isBlocked = action === 'block';
        const status = isBlocked ? 'Blocked' : 'Active';

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isBlocked, status },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `User successfully ${isBlocked ? 'blocked' : 'unblocked'}`,
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating user action:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
