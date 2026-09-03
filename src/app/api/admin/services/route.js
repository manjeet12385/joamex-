export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Service from '@/backend/models/Service';
import { verifyJWT } from '@/backend/services/authService';

export async function GET(req) {
    try {
        await connectToDatabase();
        const services = await Service.find({}).sort({ createdAt: -1 });

        // Fallback default service categories if DB is empty
        const defaultServices = [];

        return NextResponse.json({
            success: true,
            categories: services.length > 0 ? services : defaultServices // keep key 'categories' for frontend compatibility if needed
        });
    } catch (error) {
        console.error('Fetch Services Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { id, name, price, icon, description, status } = await req.json();

        if (!name || !price) {
            return NextResponse.json({ success: false, message: 'Service name and price are required' }, { status: 400 });
        }

        let service;
        if (id && id.length === 24) {
            service = await Service.findByIdAndUpdate(
                id,
                { name, price: Number(price), category: 'General', icon, description, status: status || 'Active' },
                { new: true }
            );
        } else {
            service = await Service.create({
                name,
                category: 'General', // default for now since frontend doesn't pass it yet
                price: Number(price),
                icon: icon || '🛠️',
                description: description || '',
                status: status || 'Active'
            });
        }

        return NextResponse.json({
            success: true,
            message: `Service "${name}" saved successfully!`,
            category: service
        });

    } catch (error) {
        console.error('Save Service Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
