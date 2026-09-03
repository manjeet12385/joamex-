export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Location from '@/backend/models/Location';
import { verifyJWT } from '@/lib/auth';

// Helper to check admin authorization
async function checkAuth(req) {
    const adminToken = req.cookies.get('admin_token')?.value;
    if (!adminToken) return false;
    const payload = await verifyJWT(adminToken);
    return payload && payload.email ? true : false;
}

export async function GET(req) {
    try {
        await connectToDatabase();
        const locations = await Location.find({}).populate('parent').sort({ type: 1, name: 1 });
        return NextResponse.json({ success: true, locations });
    } catch (error) {
        console.error('Fetch Locations Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { name, type, parent, pincode, isActive } = await req.json();

        if (!name || !type) {
            return NextResponse.json({ success: false, message: 'Name and Type are required' }, { status: 400 });
        }

        const newLoc = await Location.create({
            name,
            type,
            parent: parent || null,
            pincode: pincode || '',
            isActive: isActive !== undefined ? isActive : true
        });

        return NextResponse.json({ success: true, message: 'Location created successfully', location: newLoc });
    } catch (error) {
        console.error('Create Location Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { id, name, parent, pincode, isActive } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Location ID is required' }, { status: 400 });
        }

        const loc = await Location.findById(id);
        if (!loc) {
            return NextResponse.json({ success: false, message: 'Location not found' }, { status: 404 });
        }

        if (name !== undefined) loc.name = name;
        if (parent !== undefined) loc.parent = parent || null;
        if (pincode !== undefined) loc.pincode = pincode;
        if (isActive !== undefined) loc.isActive = isActive;

        await loc.save();

        return NextResponse.json({ success: true, message: 'Location updated successfully', location: loc });
    } catch (error) {
        console.error('Update Location Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Location ID is required' }, { status: 400 });
        }

        await Location.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
        console.error('Delete Location Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
