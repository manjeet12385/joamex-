export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(req) {
    try {
        await connectToDatabase();

        // 1. Calculate Financial Stats from Completed Bookings
        const revenueResult = await Booking.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        const commissionRate = 0.15; // 15% platform commission
        const platformCommission = totalRevenue * commissionRate;
        const totalPayouts = totalRevenue - platformCommission;

        // 2. Fetch Recent Completed Transactions
        const recentTransactions = await Booking.find({ status: 'Completed' })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id category createdAt totalAmount status partner');

        // Normalize transactions for the frontend table
        const formattedTransactions = recentTransactions.map(txn => ({
            id: txn._id.toString().substring(0, 8).toUpperCase(), // Short ID for display
            service: txn.category || 'Service',
            date: new Date(txn.createdAt).toLocaleString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            }),
            amount: `₹${txn.totalAmount.toLocaleString('en-IN')}`,
            commission: `₹${(txn.totalAmount * commissionRate).toLocaleString('en-IN')}`,
            status: txn.status
        }));

        return NextResponse.json({
            success: true,
            stats: {
                totalRevenue: totalRevenue,
                platformCommission: platformCommission,
                totalPayouts: totalPayouts
            },
            transactions: formattedTransactions
        });
    } catch (error) {
        console.error('Financials fetch error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch financial data' }, { status: 500 });
    }
}
