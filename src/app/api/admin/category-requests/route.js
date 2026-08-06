import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CategoryRequest from '@/models/CategoryRequest';
import Partner from '@/models/Partner';
import { verifyJWT } from '@/lib/auth';

export async function GET(req) {
    try {
        await connectToDatabase();
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;

        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized: Admin authentication required' }, { status: 401 });
        }

        const requests = await CategoryRequest.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, requests });
    } catch (error) {
        console.error('GET /api/admin/category-requests error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;

        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized: Admin authentication required' }, { status: 401 });
        }

        const body = await req.json();
        const { requestId, action, adminRemark } = body; // action: 'accept' or 'reject'

        if (!requestId || !['accept', 'reject'].includes(action)) {
            return NextResponse.json({ success: false, message: 'Valid requestId and action (accept/reject) are required' }, { status: 400 });
        }

        const requestRecord = await CategoryRequest.findById(requestId);
        if (!requestRecord) {
            return NextResponse.json({ success: false, message: 'Category request record not found' }, { status: 404 });
        }

        if (action === 'accept') {
            requestRecord.status = 'Approved';
            if (adminRemark) requestRecord.adminRemark = adminRemark;
            await requestRecord.save();

            // Append category to Partner.serviceCategory
            const partner = await Partner.findById(requestRecord.partnerId);
            if (partner) {
                let currentCats = (partner.serviceCategory || '').split(',').map(c => c.trim()).filter(Boolean);
                const newCat = requestRecord.categoryName.trim();
                const exists = currentCats.some(c => c.toLowerCase() === newCat.toLowerCase());

                if (!exists) {
                    currentCats.push(newCat);
                    partner.serviceCategory = currentCats.join(', ');
                    await partner.save();
                }
            }

            return NextResponse.json({
                success: true,
                message: `Category request for "${requestRecord.categoryName}" Approved successfully. Category added to Partner profile.`,
                request: requestRecord
            });
        }

        if (action === 'reject') {
            requestRecord.status = 'Rejected';
            if (adminRemark) requestRecord.adminRemark = adminRemark;
            await requestRecord.save();

            return NextResponse.json({
                success: true,
                message: `Category request for "${requestRecord.categoryName}" Rejected by Admin.`,
                request: requestRecord
            });
        }

    } catch (error) {
        console.error('PUT /api/admin/category-requests error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
