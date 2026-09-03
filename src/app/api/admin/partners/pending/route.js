export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/backend/config/db.js';
import Partner from '@/backend/models/Partner.js';

export async function GET() {
    try {
        await connectDB();
        const partners = await Partner.find({ status: 'Pending' }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, partners });
    } catch (error) {
        console.error('Fetch Pending Partners Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
