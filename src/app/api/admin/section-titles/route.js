export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SectionTitles from '@/backend/models/SectionTitles';

const defaultTitles = {
    most_booked: 'Most Booked Services',
    essential:   'Essential Services',
    renovation:  'Home Renovation Services',
    solarwater:  'Solar & Water Solutions',
    offers:      'Exclusive Offers'
};

// GET — fetch section titles
// ?mode=live  → returns live titles (for frontend / public pages)
// no mode     → returns draft first, then live (for admin panel preview)
export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode');

        if (mode === 'live') {
            // Frontend: return live titles only
            const doc = await SectionTitles.findOne({ status: 'live' });
            return NextResponse.json({
                success: true,
                titles: doc ? doc.toObject() : { status: 'live', ...defaultTitles }
            }, { status: 200 });
        }

        // Admin panel: draft first, then fall back to live
        let doc = await SectionTitles.findOne({ status: 'draft' });
        if (!doc) doc = await SectionTitles.findOne({ status: 'live' });
        return NextResponse.json({
            success: true,
            titles: doc ? doc.toObject() : { ...defaultTitles }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT — admin updates section titles → always saves to DRAFT (never direct to live)
export async function PUT(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const allowedKeys = Object.keys(defaultTitles);
        const updateDoc = {};
        
        let draft = await SectionTitles.findOne({ status: 'draft' });
        const live = await SectionTitles.findOne({ status: 'live' });

        allowedKeys.forEach(key => {
            if (body[key] !== undefined) {
                updateDoc[key] = body[key];
            } else {
                updateDoc[key] = draft?.[key] ?? live?.[key] ?? defaultTitles[key];
            }
        });

        const updatedDraft = await SectionTitles.findOneAndUpdate(
            { status: 'draft' },
            { $set: updateDoc },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, titles: updatedDraft.toObject() }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

