import { NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import Offer from '@/backend/models/Offer';

export async function GET() {
    try {
        await connectDB();
        const offers = await Offer.find({}).sort({ order: 1, createdAt: 1 });
        return NextResponse.json(offers);
    } catch (error) {
        console.error('Error fetching offers:', error);
        return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();
        
        const newOffer = new Offer(data);
        await newOffer.save();
        
        return NextResponse.json(newOffer, { status: 201 });
    } catch (error) {
        console.error('Error creating offer:', error);
        return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
    }
}
