import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import ExclusiveOffer from '@/backend/models/ExclusiveOffer';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'live';

        let doc = await ExclusiveOffer.findOne({ status: mode });
        
        if (!doc && mode === 'draft') {
            doc = await ExclusiveOffer.findOne({ status: 'live' });
        }
        
        return NextResponse.json({ 
            success: true, 
            offers: doc?.offers || [],
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
        
        let draft = await ExclusiveOffer.findOne({ status: 'draft' });
        const live = await ExclusiveOffer.findOne({ status: 'live' });
        
        const offersToSave = body.offers !== undefined ? body.offers : (draft?.offers || live?.offers || []);
        const sectionTitleToSave = body.sectionTitle !== undefined ? body.sectionTitle : (draft?.sectionTitle || live?.sectionTitle || '');

        const updatedDraft = await ExclusiveOffer.findOneAndUpdate(
            { status: 'draft' },
            {
                $set: {
                    offers: offersToSave,
                    sectionTitle: sectionTitleToSave
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, offers: updatedDraft.offers, sectionTitle: updatedDraft.sectionTitle });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
