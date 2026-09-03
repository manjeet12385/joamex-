export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
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
        // Return all admins in the system
        const admins = await Admin.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, admins });
    } catch (error) {
        console.error('Fetch Roles Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { fullName, email, phone, role, scopes } = await req.json();

        if (!fullName || !email || !role) {
            return NextResponse.json({ success: false, message: 'Full name, email, and role are required' }, { status: 400 });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ success: false, message: 'Admin with this email already exists' }, { status: 400 });
        }

        const newAdmin = await Admin.create({
            fullName,
            email,
            phone: phone || '',
            role: role || 'support',
            scopes: scopes || [],
            twoFactorEnabled: false
        });

        return NextResponse.json({ success: true, message: 'Admin role created successfully', admin: newAdmin });
    } catch (error) {
        console.error('Create Admin Role Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { id, fullName, phone, role, scopes } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Admin ID is required' }, { status: 400 });
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
        }

        if (fullName !== undefined) admin.fullName = fullName;
        if (phone !== undefined) admin.phone = phone;
        if (role !== undefined) admin.role = role;
        if (scopes !== undefined) admin.scopes = scopes;

        await admin.save();

        return NextResponse.json({ success: true, message: 'Admin role updated successfully', admin });
    } catch (error) {
        console.error('Update Admin Role Error:', error);
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
            return NextResponse.json({ success: false, message: 'Admin ID is required' }, { status: 400 });
        }

        // Prevent deleting the main super admin (usually the first admin or role superadmin)
        const adminToDelete = await Admin.findById(id);
        if (adminToDelete && adminToDelete.role === 'superadmin') {
            const count = await Admin.countDocuments({ role: 'superadmin' });
            if (count <= 1) {
                return NextResponse.json({ success: false, message: 'Cannot delete the only Super Admin' }, { status: 400 });
            }
        }

        await Admin.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Delete Admin Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
