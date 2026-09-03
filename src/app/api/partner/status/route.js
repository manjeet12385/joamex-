export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/backend/config/db.js';
import Partner from '@/backend/models/Partner.js';

export async function PUT(req) {
    try {
        await connectDB();
        
        // Mock partner ID since auth isn't fully wired for partner yet
        const partnerId = "60c72b2f9b1d8b001c8e4b5a"; // Replace with session ID in production
        
        const { isOnline } = await req.json();

        if (typeof isOnline !== 'boolean') {
            return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
        }

        // We will just try to update any one partner for MVP demo purposes if ID doesn't exist
        let partner = await Partner.findById(partnerId);
        if (!partner) {
            partner = await Partner.findOne(); // Fallback to first partner
        }

        if (partner) {
            partner.isOnline = isOnline;
            await partner.save();
        }

        return NextResponse.json({ success: true, isOnline });
    } catch (error) {
        console.error('Partner Status Update Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
