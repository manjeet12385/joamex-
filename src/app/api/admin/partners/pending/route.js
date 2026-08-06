import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';

export async function GET(req) {
    try {
        await connectToDatabase();
        // Fetch only pending partners, sort by newest first
        const pendingPartners = await Partner.find({ status: 'Pending' }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, partners: pendingPartners });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch pending partners' }, { status: 500 });
    }
}
