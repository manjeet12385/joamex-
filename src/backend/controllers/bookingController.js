import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectToDatabase from '@/backend/config/db';
import Booking from '@/backend/models/Booking';
import Partner from '@/backend/models/Partner';
import { verifyJWT } from '@/backend/services/authService';

export async function createBookingController(request) {
    try {
        await connectToDatabase();
        const nextAuthToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        const userToken = request.cookies.get('user_token')?.value;
        const verifiedUser = userToken ? await verifyJWT(userToken) : null;

        const body = await request.json();
        const { items, totalAmount, userDetails, scheduledDate, scheduledTimeSlot, paymentMethod } = body;

        const category = items[0]?.category || 'General';
        const addressObj = userDetails?.address && typeof userDetails.address === 'object' ? userDetails.address : {};

        const effectiveUserId = verifiedUser?.id || verifiedUser?.email || nextAuthToken?.sub || userDetails?.email || 'guest_user_id';
        const effectiveEmail = userDetails?.email || verifiedUser?.email || nextAuthToken?.email || 'guest@example.com';
        const effectiveName = userDetails?.name || verifiedUser?.name || nextAuthToken?.name || 'Guest User';

        // Check if User is Blocked
        if (effectiveEmail) {
            const User = (await import('@/backend/models/User')).default;
            const existingUser = await User.findOne({
                $or: [{ email: effectiveEmail }]
            });
            if (existingUser && (existingUser.isBlocked || existingUser.status === 'Blocked')) {
                return NextResponse.json({
                    success: false,
                    message: 'Your account has been suspended by Admin from making new service bookings. Please contact support.'
                }, { status: 403 });
            }
        }

        const newBooking = await Booking.create({
            userId: effectiveUserId,
            userDetails: {
                ...addressObj,
                name: effectiveName,
                email: effectiveEmail,
                phone: userDetails?.phone || userDetails?.phoneNumber || verifiedUser?.phone || ''
            },
            items,
            totalAmount,
            category,
            status: 'Pending',
            paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pay After Service (COD)',
            scheduledDate,
            scheduledTimeSlot
        });

        return NextResponse.json({ success: true, bookingId: newBooking._id, booking: newBooking });

    } catch (error) {
        console.error('Booking Creation Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function getBookingsController(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const partnerCategory = searchParams.get('category');

        let filter = {};

        if (role === 'partner') {
            const partnerToken = request.cookies.get('partner_token')?.value;
            const verifiedPartner = partnerToken ? await verifyJWT(partnerToken) : null;
            if (!verifiedPartner || verifiedPartner.role !== 'partner') {
                return NextResponse.json({ success: false, message: 'Unauthorized: Partner authentication required' }, { status: 401 });
            }

            if (!partnerCategory) {
                return NextResponse.json({ success: false, message: 'Partner category required' }, { status: 400 });
            }
            
            // Dynamic category matching (supports aliases like Plumbing/Plumber, AC Repair, Electrical, and new Admin categories)
            const cleanCat = partnerCategory.trim();
            const keywords = cleanCat.split(/[\s&,/]+/).filter(w => w.length >= 3);
            const categoryRegexes = [new RegExp(`^${cleanCat}$`, 'i'), ...keywords.map(kw => new RegExp(kw, 'i'))];

            filter.$or = [
                { category: { $in: categoryRegexes } },
                { 'items.category': { $in: categoryRegexes } }
            ];
        } else if (role === 'user') {
            const email = searchParams.get('email');
            const userToken = request.cookies.get('user_token')?.value;
            const verifiedUser = userToken ? await verifyJWT(userToken) : null;
            const nextAuthToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

            const activeUserEmail = email || verifiedUser?.email || nextAuthToken?.email;
            const activeUserId = verifiedUser?.id || nextAuthToken?.sub;

            const userOrConditions = [];
            if (activeUserId) userOrConditions.push({ userId: activeUserId });
            if (activeUserEmail) {
                userOrConditions.push({ userId: activeUserEmail });
                userOrConditions.push({ 'userDetails.email': activeUserEmail });
            }

            if (userOrConditions.length > 0) {
                filter.$or = userOrConditions;
            } else {
                return NextResponse.json({ success: false, message: 'Unauthorized: User authentication required' }, { status: 401 });
            }
        }

        const bookings = await Booking.find(filter).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, bookings });

    } catch (error) {
        console.error('Fetch Bookings Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function updateBookingController(request) {
    try {
        await connectToDatabase();
        
        const token = request.cookies.get('partner_token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized: No token' }, { status: 401 });
        }
        
        const decoded = await verifyJWT(token);
        if (!decoded || decoded.role !== 'partner') {
            return NextResponse.json({ success: false, message: 'Invalid Token or Role' }, { status: 403 });
        }
        
        const partner = await Partner.findById(decoded.id);
        if (!partner) {
            return NextResponse.json({ success: false, message: 'Partner not found' }, { status: 404 });
        }

        const body = await request.json();
        const { bookingId, action } = body;

        if (!bookingId) {
            return NextResponse.json({ success: false, message: 'Booking ID is required' }, { status: 400 });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        if (action === 'accept') {
            if (booking.status !== 'Pending') {
                return NextResponse.json({ success: false, message: 'Booking is already accepted or completed' }, { status: 400 });
            }

            booking.status = 'Confirmed';
            booking.partner = {
                id: partner._id.toString(),
                name: partner.fullName,
                phone: partner.phoneNumber
            };
            
            await booking.save();
            return NextResponse.json({ success: true, message: 'Booking accepted successfully', booking });
        }

        if (action === 'start') {
            if (booking.status !== 'Confirmed') {
                return NextResponse.json({ success: false, message: 'Booking must be Confirmed to start work' }, { status: 400 });
            }

            booking.status = 'In-Progress';
            await booking.save();
            return NextResponse.json({ success: true, message: 'Work started successfully', booking });
        }

        if (action === 'complete') {
            if (booking.status !== 'In-Progress') {
                return NextResponse.json({ success: false, message: 'Work must be In-Progress to mark as completed' }, { status: 400 });
            }

            booking.status = 'Completed';
            await booking.save();
            return NextResponse.json({ success: true, message: 'Work completed successfully', booking });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Update Booking Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
