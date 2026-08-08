import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Payout from '@/backend/models/Payout';
import Partner from '@/models/Partner';
import Booking from '@/models/Booking';
import { verifyJWT } from '@/backend/services/authService';

export async function GET(req) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const payouts = await Payout.find({}).sort({ createdAt: -1 });

        // Calculate pending payouts from completed bookings
        const completedBookings = await Booking.find({ status: 'Completed' });
        const partners = await Partner.find({});

        const pendingPayoutsMap = {};
        completedBookings.forEach(b => {
            if (b.partnerId) {
                const pid = b.partnerId.toString();
                if (!pendingPayoutsMap[pid]) {
                    pendingPayoutsMap[pid] = { amount: 0, bookingCount: 0 };
                }
                pendingPayoutsMap[pid].amount += (b.totalAmount || 0) * 0.85; // 85% payout
                pendingPayoutsMap[pid].bookingCount += 1;
            }
        });

        const partnersWithPending = partners.map(p => {
            const pid = p._id.toString();
            const pending = pendingPayoutsMap[pid] || { amount: 0, bookingCount: 0 };
            return {
                _id: p._id,
                fullName: p.fullName,
                email: p.email,
                phoneNumber: p.phoneNumber,
                accountHolderName: p.accountHolderName,
                bankName: p.bankName,
                accountNumber: p.accountNumber,
                ifscCode: p.ifscCode,
                pendingAmount: Math.round(pending.amount),
                completedBookings: pending.bookingCount
            };
        });

        return NextResponse.json({
            success: true,
            payouts,
            partnerPayouts: partnersWithPending
        });

    } catch (error) {
        console.error('Fetch Payouts Error:', error);
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
        const { partnerId, amount, transactionId } = await req.json();

        if (!partnerId || !amount) {
            return NextResponse.json({ success: false, message: 'Partner ID and Amount are required' }, { status: 400 });
        }

        const partner = await Partner.findById(partnerId);
        if (!partner) {
            return NextResponse.json({ success: false, message: 'Partner not found' }, { status: 404 });
        }

        const newPayout = await Payout.create({
            partnerId: partner._id,
            partnerName: partner.fullName,
            partnerEmail: partner.email,
            partnerPhone: partner.phoneNumber,
            amount: Number(amount),
            status: 'Paid',
            paidAt: new Date(),
            transactionId: transactionId || `TXN${Date.now()}`
        });

        return NextResponse.json({
            success: true,
            message: `Payout of ₹${amount} successfully released to ${partner.fullName}`,
            payout: newPayout
        });

    } catch (error) {
        console.error('Release Payout Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
