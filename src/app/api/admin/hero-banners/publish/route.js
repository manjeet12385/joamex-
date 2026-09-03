export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HeroBanner from '@/backend/models/HeroBanner';

export async function POST(req) {
    try {
        await connectToDatabase();
        
        // Find the draft document
        const draftDoc = await HeroBanner.findOne({ status: 'draft' }).lean();
        
        if (!draftDoc) {
            return NextResponse.json({ success: true, message: 'No drafts to publish' }, { status: 200 });
        }

        // Remove the draft status so it can become live
        delete draftDoc._id;
        delete draftDoc.createdAt;
        delete draftDoc.updatedAt;
        draftDoc.status = 'live';

        // Update the live document with draft data (or create if missing)
        let liveDoc = await HeroBanner.findOne({ status: 'live' });
        if (!liveDoc) {
            await HeroBanner.create(draftDoc);
        } else {
            await HeroBanner.findByIdAndUpdate(liveDoc._id, { $set: draftDoc });
        }

        // Delete the draft document now that it's published
        await HeroBanner.deleteMany({ status: 'draft' });

        return NextResponse.json({ success: true, message: 'Draft published to live successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
