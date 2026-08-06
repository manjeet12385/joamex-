import { NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import Offer from '@/backend/models/Offer';

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const data = await req.json();
        
        const updatedOffer = await Offer.findByIdAndUpdate(id, data, { new: true });
        if (!updatedOffer) {
            return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
        }
        
        return NextResponse.json(updatedOffer);
    } catch (error) {
        console.error('Error updating offer:', error);
        return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        
        const deletedOffer = await Offer.findByIdAndDelete(id);
        if (!deletedOffer) {
            return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting offer:', error);
        return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
    }
}
