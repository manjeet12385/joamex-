export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Service from '@/backend/models/Service';
import { verifyJWT } from '@/backend/services/authService';

export async function DELETE(req, { params }) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        
        const resolvedParams = await params;
        const id = resolvedParams?.id;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Service ID is required' }, { status: 400 });
        }

        const existingService = await Service.findById(id);

        if (!existingService) {
            return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
        }

        let deletedService;
        if (existingService.publishStatus === 'live') {
            const draftData = {
                ...existingService.toObject(),
                _id: undefined,
                publishStatus: 'draft_deleted',
                liveServiceId: existingService._id
            };
            delete draftData.id;
            deletedService = await Service.create(draftData);
        } else {
            deletedService = await Service.findByIdAndDelete(id);
        }

        return NextResponse.json({
            success: true,
            message: `Service "${deletedService.name}" deleted successfully`
        });

    } catch (error) {
        console.error('DELETE Service Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
