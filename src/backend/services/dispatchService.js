import Partner from '../models/Partner.js';
import Booking from '../models/Booking.js';

/**
 * Finds the nearest online partner for a given category and location
 */
export const findMatchForBooking = async (category, customerLat, customerLng) => {
    try {
        // Find partners who are online and match the category
        // In a real production scenario, use $near with MongoDB geospatial indexing
        // Here we just find online partners for the category as a simplified matchmaking
        
        const availablePartners = await Partner.find({
            status: 'Active',
            isOnline: true,
            serviceCategory: category
        });

        if (availablePartners.length === 0) {
            return null; // No partners available
        }

        // Simplistic match: just pick the first available one for MVP
        // Next step would be calculating distance using customerLat/Lng
        return availablePartners[0];

    } catch (error) {
        console.error("Matchmaking error:", error);
        return null;
    }
};

/**
 * Assigns a booking to a partner and triggers dispatch
 */
export const dispatchJob = async (bookingId, partnerId) => {
    try {
        const partner = await Partner.findById(partnerId);
        if (!partner) throw new Error("Partner not found");

        const booking = await Booking.findById(bookingId);
        if (!booking) throw new Error("Booking not found");

        booking.partner = {
            id: partner._id,
            name: partner.fullName,
            phone: partner.phoneNumber
        };
        booking.trackingStatus = 'Dispatched';
        booking.status = 'Confirmed';
        
        // Generate OTPs
        booking.jobStartOtp = Math.floor(1000 + Math.random() * 9000).toString();
        booking.jobEndOtp = Math.floor(1000 + Math.random() * 9000).toString();

        await booking.save();

        // In a real app, you would send a Push Notification or SMS here
        console.log(`[DISPATCH] Job ${bookingId} assigned to ${partner.fullName}`);
        console.log(`[OTP] Start: ${booking.jobStartOtp}, End: ${booking.jobEndOtp}`);

        return booking;
    } catch (error) {
        console.error("Dispatch error:", error);
        throw error;
    }
};
