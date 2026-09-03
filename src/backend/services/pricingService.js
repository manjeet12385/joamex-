import SystemConfig from '../models/SystemConfig.js';

/**
 * Calculates dynamic price based on base price, demand, and time of day
 */
export const calculateDynamicPrice = async (basePrice, category) => {
    try {
        // In a real app, fetch surge settings from DB (Admin control panel)
        // Default multipliers
        let surgeMultiplier = 1.0;

        const config = await SystemConfig.findOne();
        if (config && config.surgePricingActive) {
            surgeMultiplier = config.surgeMultiplier || 1.2; // 20% surge
        }

        // Add additional logic here (e.g. night time surge, weekend surge, high demand)
        const hour = new Date().getHours();
        if (hour >= 20 || hour <= 6) {
            // Night time surge 1.5x
            surgeMultiplier = Math.max(surgeMultiplier, 1.5);
        }

        const finalPrice = Math.round(basePrice * surgeMultiplier);

        return {
            basePrice,
            finalPrice,
            surgeMultiplier
        };

    } catch (error) {
        console.error("Pricing error:", error);
        return { basePrice, finalPrice: basePrice, surgeMultiplier: 1.0 };
    }
};
