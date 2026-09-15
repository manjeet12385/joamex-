import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import Category from '@/backend/models/Category';
import ExclusiveOffer from '@/backend/models/ExclusiveOffer';
import FeatureBanner from '@/backend/models/FeatureBanner';
import HeroBanner from '@/backend/models/HeroBanner';
import MostBookedService from '@/backend/models/MostBookedService';
import EssentialService from '@/backend/models/EssentialService';
import HomeRenovation from '@/backend/models/HomeRenovation';
import SolarWaterSolution from '@/backend/models/SolarWaterSolution';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        await connectToDatabase();
        
        const models = [
            Category, ExclusiveOffer, FeatureBanner, HeroBanner,
            MostBookedService, EssentialService, HomeRenovation, SolarWaterSolution
        ];

        for (const model of models) {
            await model.deleteOne({ status: 'draft' });
        }
        
        const { default: Service } = await import('@/backend/models/Service');
        await Service.deleteMany({ publishStatus: { $in: ['draft', 'draft_deleted'] } });
        
        return NextResponse.json({ success: true, message: 'All draft changes discarded.' });
    } catch (error) {
        console.error('Discard All Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
