export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CategoryRequest from '@/models/CategoryRequest';
import Partner from '@/models/Partner';
import Category from '@/models/Category';
import { verifyJWT } from '@/lib/auth';

export async function GET(req) {
    try {
        await connectToDatabase();
        const token = req.cookies.get('partner_token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyJWT(token);
        if (!decoded || decoded.role !== 'partner') {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 403 });
        }

        const partnerId = typeof decoded.id === 'object' && decoded.id.toString ? decoded.id.toString() : decoded.id;

        const requests = await CategoryRequest.find({ partnerId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, requests });
    } catch (error) {
        console.error('GET /api/partner/category-request error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const token = req.cookies.get('partner_token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyJWT(token);
        if (!decoded || decoded.role !== 'partner') {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 403 });
        }

        const partnerId = typeof decoded.id === 'object' && decoded.id.toString ? decoded.id.toString() : decoded.id;
        const partner = await Partner.findById(partnerId);

        if (!partner) {
            return NextResponse.json({ success: false, message: 'Partner profile not found' }, { status: 404 });
        }

        const body = await req.json();
        const { categoryName } = body;

        if (!categoryName || !categoryName.trim()) {
            return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
        }

        const cleanCategory = categoryName.trim();

        // Check if category is already in partner's active categories
        const existingCategories = (partner.serviceCategory || '').split(',').map(c => c.trim().toLowerCase());
        if (existingCategories.includes(cleanCategory.toLowerCase())) {
            return NextResponse.json({ success: false, message: `You are already offering services under "${cleanCategory}"` }, { status: 400 });
        }

        // Check if there is already a Pending request for this category
        const existingPending = await CategoryRequest.findOne({
            partnerId: partner._id.toString(),
            categoryName: { $regex: `^${cleanCategory}$`, $options: 'i' },
            status: 'Pending'
        });

        if (existingPending) {
            return NextResponse.json({ success: false, message: `A request for "${cleanCategory}" is already pending admin approval` }, { status: 400 });
        }

        const newRequest = await CategoryRequest.create({
            partnerId: partner._id.toString(),
            partnerName: partner.fullName || 'Partner',
            partnerEmail: partner.email || '',
            partnerPhone: partner.phoneNumber || '',
            categoryName: cleanCategory,
            status: 'Pending'
        });

        return NextResponse.json({
            success: true,
            message: `Request for "${cleanCategory}" submitted to Admin for approval.`,
            request: newRequest
        }, { status: 201 });

    } catch (error) {
        console.error('POST /api/partner/category-request error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
