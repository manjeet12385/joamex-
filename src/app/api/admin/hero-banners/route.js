import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import HeroBanner from '@/backend/models/HeroBanner';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'live';

        let doc = await HeroBanner.findOne({ status: mode });
        
        if (!doc && mode === 'draft') {
            doc = await HeroBanner.findOne({ status: 'live' });
        }
        
        const banner = doc?.banners?.[0] || null;
        
        return NextResponse.json({ 
            success: true, 
            data: banner,
            banners: doc?.banners || [],
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
        
        let draft = await HeroBanner.findOne({ status: 'draft' });
        const live = await HeroBanner.findOne({ status: 'live' });
        
        let bannersToSave = draft?.banners || live?.banners || [];
        let sectionTitleToSave = draft?.sectionTitle || live?.sectionTitle || '';

        if (body.slide0 !== undefined || body.heroTitle !== undefined) {
            // Old format from Hero.js - store entire object as banners[0]
            bannersToSave = [body];
            if (body.heroTitle) sectionTitleToSave = body.heroTitle;
        } else if (body.sideCards !== undefined) {
            // Saving only side cards
            let currentBanners = [...bannersToSave];
            if (!currentBanners[0]) currentBanners[0] = {};
            currentBanners[0] = { ...currentBanners[0], sideCards: body.sideCards };
            bannersToSave = currentBanners;
        } else if (body.banners !== undefined) {
            bannersToSave = body.banners;
        }
        
        if (body.sectionTitle !== undefined) {
            sectionTitleToSave = body.sectionTitle;
        }

        const updatedDraft = await HeroBanner.findOneAndUpdate(
            { status: 'draft' },
            {
                $set: {
                    banners: bannersToSave,
                    sectionTitle: sectionTitleToSave
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: updatedDraft.banners?.[0] || {}, banners: updatedDraft.banners });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
