export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Service from '@/backend/models/Service';
import { verifyJWT } from '@/backend/services/authService';

export async function GET(req) {
    try {
        await connectToDatabase();
        const allServices = await Service.find({ publishStatus: { $ne: 'draft_deleted' } }).sort({ createdAt: -1 }).lean();

        const drafts = allServices.filter(s => s.publishStatus === 'draft');
        const lives = allServices.filter(s => s.publishStatus === 'live');
        
        const liveIdsWithDraft = new Set(drafts.map(d => d.liveServiceId?.toString()).filter(Boolean));
        
        let adminServices = lives.filter(l => !liveIdsWithDraft.has(l._id.toString()));
        adminServices.push(...drafts);
        
        adminServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json({
            success: true,
            categories: adminServices
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
            const existing = await Service.findById(id);
            if (!existing) {
                return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
            }
            if (existing.publishStatus === 'live') {
                const draftData = {
                    ...existing.toObject(),
                    _id: undefined,
                    name, 
                    price: Number(price), 
                    category: 'General', 
                    icon: icon || existing.icon, 
                    description: description || existing.description,
                    publishStatus: 'draft',
                    liveServiceId: existing._id
                };
                delete draftData.id;
                service = await Service.create(draftData);
            } else {
                service = await Service.findByIdAndUpdate(
                    id,
                    { name, price: Number(price), category: 'General', icon, description },
                    { new: true }
                );
            }
        } else {
            service = await Service.create({
                name,
                category: 'General', // default for now since frontend doesn't pass it yet
                price: Number(price),
                icon: icon || '🛠️',
                description: description || '',
                publishStatus: 'draft'
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
