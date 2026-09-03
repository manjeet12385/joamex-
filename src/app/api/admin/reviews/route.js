export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Review from '@/backend/models/Review';
import { verifyJWT } from '@/backend/services/authService';

export async function GET(req) {
    try {
        await connectToDatabase();
        const reviews = await Review.find({}).sort({ createdAt: -1 });

        const mockReviews = [
            { _id: 'r1', userName: 'Rahul Sharma', partnerName: 'David Chen', rating: 5, comment: 'Excellent plumbing work! Solved the leak in 20 minutes.', status: 'Approved', createdAt: new Date() },
            { _id: 'r2', userName: 'Priya Verma', partnerName: 'Amit Kumar', rating: 4, comment: 'Good service for fan repair, arrived on time.', status: 'Approved', createdAt: new Date() },
            { _id: 'r3', userName: 'Suresh Gupta', partnerName: 'Vikram Singh', rating: 1, comment: 'Late response and unfinished wiring work.', status: 'Approved', createdAt: new Date() }
        ];

        return NextResponse.json({
            success: true,
            reviews: reviews.length > 0 ? reviews : mockReviews
        });
    } catch (error) {
        console.error('Fetch Reviews Error:', error);
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
        const { reviewId, action } = await req.json(); // action: 'approve', 'hide', 'delete'

        if (!reviewId || !action) {
            return NextResponse.json({ success: false, message: 'Review ID and action required' }, { status: 400 });
        }

        if (action === 'delete') {
            await Review.findByIdAndDelete(reviewId);
            return NextResponse.json({ success: true, message: 'Review deleted successfully' });
        }

        const status = action === 'hide' ? 'Hidden' : 'Approved';
        const updated = await Review.findByIdAndUpdate(reviewId, { status }, { new: true });

        return NextResponse.json({
            success: true,
            message: `Review marked as ${status}`,
            review: updated
        });

    } catch (error) {
        console.error('Review Action Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
