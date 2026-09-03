export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Coupon from '@/backend/models/Coupon';
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
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, coupons });
    } catch (error) {
        console.error('Fetch Coupons Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { code, discountType, discountValue, minPurchase, maxDiscount, startDate, endDate, usageLimit, isActive } = await req.json();

        if (!code || !discountValue || !endDate) {
            return NextResponse.json({ success: false, message: 'Code, discount value, and end date are required' }, { status: 400 });
        }

        const newCoupon = await Coupon.create({
            code: code.trim().toUpperCase(),
            discountType: discountType || 'Percentage',
            discountValue: Number(discountValue),
            minPurchase: Number(minPurchase) || 0,
            maxDiscount: Number(maxDiscount) || 0,
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: new Date(endDate),
            usageLimit: usageLimit !== undefined && usageLimit !== '' ? Number(usageLimit) : null,
            isActive: isActive !== undefined ? isActive : true
        });

        return NextResponse.json({ success: true, message: 'Coupon created successfully', coupon: newCoupon });
    } catch (error) {
        console.error('Create Coupon Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { id, code, discountType, discountValue, minPurchase, maxDiscount, startDate, endDate, usageLimit, isActive } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Coupon ID is required' }, { status: 400 });
        }

        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
        }

        if (code !== undefined) coupon.code = code.trim().toUpperCase();
        if (discountType !== undefined) coupon.discountType = discountType;
        if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
        if (minPurchase !== undefined) coupon.minPurchase = Number(minPurchase);
        if (maxDiscount !== undefined) coupon.maxDiscount = Number(maxDiscount);
        if (startDate !== undefined) coupon.startDate = new Date(startDate);
        if (endDate !== undefined) coupon.endDate = new Date(endDate);
        if (usageLimit !== undefined) coupon.usageLimit = usageLimit !== '' ? Number(usageLimit) : null;
        if (isActive !== undefined) coupon.isActive = isActive;

        await coupon.save();

        return NextResponse.json({ success: true, message: 'Coupon updated successfully', coupon });
    } catch (error) {
        console.error('Update Coupon Error:', error);
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
            return NextResponse.json({ success: false, message: 'Coupon ID is required' }, { status: 400 });
        }

        await Coupon.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Delete Coupon Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
