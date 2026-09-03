export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import AuditLog from '@/backend/models/AuditLog';
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
        const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(100);
        return NextResponse.json({ success: true, logs });
    } catch (error) {
        console.error('Fetch Audit Logs Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { action, details, targetId } = await req.json();

        const adminToken = req.cookies.get('admin_token')?.value;
        const payload = await verifyJWT(adminToken);
        const adminUser = payload?.email || 'admin@gmail.com';

        if (!action || !details) {
            return NextResponse.json({ success: false, message: 'Action and details are required' }, { status: 400 });
        }

        const log = await AuditLog.create({
            adminUser,
            action,
            details,
            targetId: targetId || null,
            ipAddress: req.headers.get('x-forwarded-for') || req.ip || ''
        });

        return NextResponse.json({ success: true, log });
    } catch (error) {
        console.error('Create Audit Log Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
