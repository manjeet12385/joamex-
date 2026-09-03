import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import FeatureBanner from '@/backend/models/FeatureBanner';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'live';

        let doc = await FeatureBanner.findOne({ status: mode });
        
        if (!doc && mode === 'draft') {
            doc = await FeatureBanner.findOne({ status: 'live' });
        }
        
        return NextResponse.json({ 
            success: true, 
            banners: doc?.banners || [],
            
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
        
        let draft = await FeatureBanner.findOne({ status: 'draft' });
        const live = await FeatureBanner.findOne({ status: 'live' });
        
        const bannersToSave = body.banners !== undefined ? body.banners : (draft?.banners || live?.banners || []);

        const updatedDraft = await FeatureBanner.findOneAndUpdate(
            { status: 'draft' },
            {
                $set: {
                    banners: bannersToSave
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, banners: updatedDraft.banners });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
