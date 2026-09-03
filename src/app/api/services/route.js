export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import Service from '@/backend/models/Service';

export async function GET(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const category = url.searchParams.get('category');
        
        let query = {};
        if (category) {
            query.category = category;
        }

        const services = await Service.find(query).sort({ order: 1, createdAt: 1 });
        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();
        
        const newService = new Service(data);
        await newService.save();
        
        return NextResponse.json(newService, { status: 201 });
    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
