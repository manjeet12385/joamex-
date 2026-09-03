import Transaction from '../models/Transaction.js';
import Booking from '../models/Booking.js';
import Partner from '../models/Partner.js';
import Vendor from '../models/Vendor.js';

const PLATFORM_FEE_PERCENTAGE = 15; // 15% platform commission

/**
 * Calculates and splits the revenue for a completed booking
 */
export const processRevenueSplit = async (bookingId) => {
    try {
        const booking = await Booking.findById(bookingId).populate('partner.id');
        if (!booking) throw new Error("Booking not found");
        if (booking.status !== 'Completed') throw new Error("Booking is not completed");

        const totalAmount = booking.totalAmount;
        
        // Calculate splits
        const commissionCut = (totalAmount * PLATFORM_FEE_PERCENTAGE) / 100;
        let partnerEarnings = totalAmount - commissionCut;
        let vendorEarnings = 0;

        const partnerId = booking.partner.id;
        const partner = await Partner.findById(partnerId);

        // If partner belongs to a vendor, Vendor gets the money, then vendor distributes
        if (partner && partner.vendorId) {
            vendorEarnings = partnerEarnings;
            partnerEarnings = 0; // Partner gets paid by vendor
            
            // Update Vendor Wallet
            await Vendor.findByIdAndUpdate(partner.vendorId, {
                $inc: { walletBalance: vendorEarnings, totalEarnings: vendorEarnings }
            });

            // Log Vendor Transaction
            await Transaction.create({
                userId: partner.vendorId,
                userType: 'Vendor',
                bookingId: booking._id,
                amount: vendorEarnings,
                type: 'Credit',
                description: `Payout for booking ${bookingId} completed by ${partner.fullName}`,
                status: 'Completed'
            });
        } else if (partner) {
            // Update Partner Wallet directly
            await Partner.findByIdAndUpdate(partnerId, {
                $inc: { walletBalance: partnerEarnings, lifetimeEarnings: partnerEarnings }
            });

            // Log Partner Transaction
            await Transaction.create({
                userId: partnerId,
                userType: 'Partner',
                bookingId: booking._id,
                amount: partnerEarnings,
                type: 'Credit',
                description: `Payout for booking ${bookingId}`,
                status: 'Completed'
            });
        }

        // Update booking financials
        booking.commissionCut = commissionCut;
        booking.partnerEarnings = partnerEarnings;
        booking.vendorEarnings = vendorEarnings;
        await booking.save();

        return { commissionCut, partnerEarnings, vendorEarnings };

    } catch (error) {
        console.error("Revenue split error:", error);
        throw error;
    }
};
