import { NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import Service from '@/backend/models/Service';

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const data = await req.json();
        
        const updatedService = await Service.findByIdAndUpdate(id, data, { new: true });
        if (!updatedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
        
        return NextResponse.json(updatedService);
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
