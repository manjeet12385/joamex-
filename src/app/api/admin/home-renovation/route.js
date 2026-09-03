import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import HomeRenovation from '@/backend/models/HomeRenovation';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'live';

        let doc = await HomeRenovation.findOne({ status: mode });
        
        if (!doc && mode === 'draft') {
            doc = await HomeRenovation.findOne({ status: 'live' });
        }
        
        return NextResponse.json({ 
            success: true, 
            services: doc?.services || [],
            sectionTitle: doc?.sectionTitle || ''
        });
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        
        let draft = await HomeRenovation.findOne({ status: 'draft' });
        const live = await HomeRenovation.findOne({ status: 'live' });
        
        let servicesToSave = draft?.services || live?.services || [];
        const sectionTitleToSave = body.sectionTitle !== undefined ? body.sectionTitle : (draft?.sectionTitle || live?.sectionTitle || '');

        if (body.services !== undefined) servicesToSave = body.services;
        else if (body.items !== undefined) servicesToSave = body.items;

        const updatedDraft = await HomeRenovation.findOneAndUpdate(
            { status: 'draft' },
            {
                $set: {
                    services: servicesToSave,
                    sectionTitle: sectionTitleToSave
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, services: updatedDraft.services, sectionTitle: updatedDraft.sectionTitle });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
