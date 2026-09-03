export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/backend/config/db.js';
import Partner from '@/backend/models/Partner.js';

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ success: false, message: 'Status is required' }, { status: 400 });
        }

        const partner = await Partner.findById(id);
        if (!partner) {
            return NextResponse.json({ success: false, message: 'Partner not found' }, { status: 404 });
        }

        partner.status = status;
        await partner.save();

        return NextResponse.json({ success: true, partner });
    } catch (error) {
        console.error('Update Partner Status Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
