import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SiteContent from '@/models/SiteContent';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};

export async function GET() {
    try {
        await connectDB();
        const content = await SiteContent.findOne({ documentId: 'global' });
        
        if (!content) {
            return NextResponse.json({ data: {} }, { status: 200 });
        }
        
        return NextResponse.json({ data: content.data }, { status: 200 });
    } catch (error) {
        console.error('Error fetching site content:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Basic security: In a real app, verify admin token here using next-auth/jwt or headers
        // Since we are building an MVP API, we rely on frontend hiding the button
        // But for safety, you should check session: const session = await getServerSession(authOptions);
        
        const body = await req.json();
        const { data } = body;
        
        if (!data) {
            return NextResponse.json({ error: 'No data provided' }, { status: 400 });
        }

        await connectDB();
        
        const updated = await SiteContent.findOneAndUpdate(
            { documentId: 'global' },
            { $set: { data: data } },
            { new: true, upsert: true }
        );

        return NextResponse.json({ message: 'Content saved successfully', data: updated.data }, { status: 200 });
    } catch (error) {
        console.error('Error saving site content:', error);
        return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
    }
}
