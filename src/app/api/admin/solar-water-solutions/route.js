import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import SolarWaterSolution from '@/backend/models/SolarWaterSolution';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'live';

        let doc = await SolarWaterSolution.findOne({ status: mode });
        
        if (!doc && mode === 'draft') {
            doc = await SolarWaterSolution.findOne({ status: 'live' });
        }
        
        return NextResponse.json({ 
            success: true, 
            solutions: doc?.solutions || [],
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
        
        let draft = await SolarWaterSolution.findOne({ status: 'draft' });
        const live = await SolarWaterSolution.findOne({ status: 'live' });
        
        let solutionsToSave = draft?.solutions || live?.solutions || [];
        const sectionTitleToSave = body.sectionTitle !== undefined ? body.sectionTitle : (draft?.sectionTitle || live?.sectionTitle || '');

        if (body.solutions !== undefined) solutionsToSave = body.solutions;
        else if (body.items !== undefined) solutionsToSave = body.items;
        const updatedDraft = await SolarWaterSolution.findOneAndUpdate(
            { status: 'draft' },
            {
                $set: {
                    solutions: solutionsToSave,
                    sectionTitle: sectionTitleToSave
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, solutions: updatedDraft.solutions, sectionTitle: updatedDraft.sectionTitle });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
