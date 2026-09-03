export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SystemConfig from '@/backend/models/SystemConfig.js';
import connectDB from '@/backend/config/db.js';

export async function GET() {
    try {
        await connectDB();
        let config = await SystemConfig.findOne();
        
        if (!config) {
            // Return empty defaults — do NOT auto-create in DB
            return NextResponse.json({ success: true, config: { surgePricingActive: false, surgeMultiplier: 1, nightSurgeMultiplier: 1 } });
        }
        
        return NextResponse.json({ success: true, config });
    } catch (error) {
        console.error('Pricing GET Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        const data = await req.json();
        
        let config = await SystemConfig.findOne();
        
        if (!config) {
            config = new SystemConfig();
        }
        
        if (data.surgePricingActive !== undefined) config.surgePricingActive = data.surgePricingActive;
        if (data.surgeMultiplier !== undefined) config.surgeMultiplier = data.surgeMultiplier;
        if (data.nightSurgeMultiplier !== undefined) config.nightSurgeMultiplier = data.nightSurgeMultiplier;
        
        await config.save();
        
        return NextResponse.json({ success: true, config });
    } catch (error) {
        console.error('Pricing PUT Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
