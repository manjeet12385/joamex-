import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import Category from '@/backend/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'live';
        // Also support ?status=Active (used by partner dashboard) — treat as live
        const statusParam = searchParams.get('status');

        // If partner/frontend uses ?status=Active, return the live doc categories list
        if (statusParam) {
            const liveDoc = await Category.findOne({ status: 'live' });
            const cats = (liveDoc?.categories || []).filter(c => {
                // If category has its own status field, filter by it; otherwise include all
                return !c.status || c.status.toLowerCase() === statusParam.toLowerCase();
            });
            return NextResponse.json({
                success: true,
                categories: cats,
                sectionTitle: liveDoc?.sectionTitle || ''
            });
        }

        let doc = await Category.findOne({ status: mode });
        
        if (!doc && mode === 'draft') {
            doc = await Category.findOne({ status: 'live' });
        }
        
        return NextResponse.json({ 
            success: true, 
            categories: doc?.categories || [],
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
        
        let draft = await Category.findOne({ status: 'draft' });
        const live = await Category.findOne({ status: 'live' });
        
        const categoriesToSave = body.categories !== undefined ? body.categories : (draft?.categories || live?.categories || []);
        
        let sectionTitleToSave = draft?.sectionTitle || live?.sectionTitle || 'What are you looking for?';
        if (body.sectionTitle !== undefined && body.sectionTitle !== null) {
            sectionTitleToSave = body.sectionTitle;
        }

        const updatedDraft = await Category.findOneAndUpdate(
            { status: 'draft' },
            {
                $set: {
                    categories: categoriesToSave,
                    sectionTitle: sectionTitleToSave
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ 
            success: true, 
            categories: updatedDraft.categories,
            sectionTitle: updatedDraft.sectionTitle 
        });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
