import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import MostBookedService from '@/backend/models/MostBookedService';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'live';

        let doc = await MostBookedService.findOne({ status: mode });
        
        if (!doc && mode === 'draft') {
            doc = await MostBookedService.findOne({ status: 'live' });
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
        
        let draft = await MostBookedService.findOne({ status: 'draft' });
        const live = await MostBookedService.findOne({ status: 'live' });
        
        const servicesToSave = body.services !== undefined ? body.services : (draft?.services || live?.services || []);
        const sectionTitleToSave = body.sectionTitle !== undefined ? body.sectionTitle : (draft?.sectionTitle || live?.sectionTitle || '');

        const updatedDraft = await MostBookedService.findOneAndUpdate(
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
