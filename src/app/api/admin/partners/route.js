export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';

import { verifyJWT } from '@/backend/services/authService';

export async function GET(req) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized: Admin authentication required' }, { status: 401 });
        }

        await connectToDatabase();

        // Fetch all partners, sorted by newest first
        const partners = await Partner.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: partners });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch partners' }, { status: 500 });
    }
}
