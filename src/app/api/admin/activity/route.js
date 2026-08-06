import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';
import User from '@/models/User';

export async function GET(req) {
    try {
        await connectToDatabase();

        // 1. Fetch recent 5 partners
        const recentPartners = await Partner.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('fullName serviceCategory createdAt status');

        // 2. Fetch recent 5 users
        const recentUsers = await User.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('fullName email createdAt');

        // 3. Normalize and combine
        const activities = [
            ...recentPartners.map(p => ({
                id: p._id,
                type: 'partner',
                title: 'New Partner Registration',
                description: `${p.fullName} applied for ${p.serviceCategory}`,
                status: p.status,
                timestamp: p.createdAt
            })),
            ...recentUsers.map(u => ({
                id: u._id,
                type: 'user',
                title: 'New User Registration',
                description: `${u.fullName} joined the platform`,
                timestamp: u.createdAt
            }))
        ];

        // 4. Sort by timestamp (newest first) and take top 5
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentActivity = activities.slice(0, 5);

        return NextResponse.json({ success: true, activities: recentActivity });
    } catch (error) {
        console.error('Activity fetch error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch activity' }, { status: 500 });
    }
}
