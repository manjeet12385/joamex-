export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/backend/config/db.js';
import Partner from '@/backend/models/Partner.js';

export async function GET(req) {
    try {
        await connectDB();
        // Mock vendor ID for MVP since auth isn't fully wired for vendor yet
        const vendorId = "vendor_demo_123"; 

        // Fetch partners that belong to this vendor
        // In a real app, we would query { vendorId } but let's just return all for demo
        const partners = await Partner.find({}).sort({ createdAt: -1 });
        
        return NextResponse.json({ success: true, staff: partners });
    } catch (error) {
        console.error('Fetch Vendor Staff Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
