import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';
import Booking from '@/models/Booking';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get('phone') || '+918009799550';
        const category = searchParams.get('category');
        const action = searchParams.get('action'); // 'verify', 'update'

        const partner = await Partner.findOne({ phoneNumber: phone });
        if (!partner) {
            return NextResponse.json({ success: false, message: `Partner not found for phone ${phone}` });
        }

        let updated = false;

        if (category) {
            partner.serviceCategory = category;
            updated = true;
        }

        if (action === 'verify') {
            partner.status = 'Verified';
            updated = true;
        }

        if (updated) {
            await partner.save();
        }

        return NextResponse.json({
            success: true,
            message: 'Partner info retrieved/updated successfully',
            partner: {
                fullName: partner.fullName,
                phoneNumber: partner.phoneNumber,
                serviceCategory: partner.serviceCategory,
                status: partner.status
            }
        });

    } catch (err) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
