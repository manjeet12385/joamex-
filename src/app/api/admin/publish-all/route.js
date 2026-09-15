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
import SectionTitles from '@/backend/models/SectionTitles';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        await connectToDatabase();
        
        const models = [
            { model: Category, arrKey: 'categories', titleKey: 'sectionTitle' },
            { model: ExclusiveOffer, arrKey: 'offers', titleKey: 'sectionTitle' },
            { model: FeatureBanner, arrKey: 'banners', titleKey: null },
            { model: HeroBanner, arrKey: 'banners', titleKey: 'sectionTitle' },
            { model: MostBookedService, arrKey: 'services', titleKey: 'sectionTitle' },
            { model: EssentialService, arrKey: 'services', titleKey: 'sectionTitle' },
            { model: HomeRenovation, arrKey: 'services', titleKey: 'sectionTitle' },
            { model: SolarWaterSolution, arrKey: 'solutions', titleKey: 'sectionTitle' }
        ];

        for (const { model, arrKey, titleKey } of models) {
            const draft = await model.findOne({ status: 'draft' });
            if (draft) {
                let live = await model.findOne({ status: 'live' });
                if (!live) {
                    live = new model({ status: 'live' });
                }
                live[arrKey] = draft[arrKey];
                if (titleKey) live[titleKey] = draft[titleKey];
                await live.save();
                
                await model.deleteOne({ status: 'draft' });
            }
        }
        
        // Publish SectionTitles (different structure — no arrKey)
        const sectionTitlesDraft = await SectionTitles.findOne({ status: 'draft' });
        if (sectionTitlesDraft) {
            const titleFields = ['most_booked', 'essential', 'renovation', 'solarwater', 'offers'];
            let liveSTDoc = await SectionTitles.findOne({ status: 'live' });
            if (!liveSTDoc) {
                liveSTDoc = new SectionTitles({ status: 'live' });
            }
            titleFields.forEach(key => { liveSTDoc[key] = sectionTitlesDraft[key]; });
            await liveSTDoc.save();
            await SectionTitles.deleteOne({ status: 'draft' });
        }
        
        // Publish Services (individual documents)
        const { default: Service } = await import('@/backend/models/Service');
        
        // 1. Delete all draft_deleted services and their live counterparts
        const draftDeletes = await Service.find({ publishStatus: 'draft_deleted' });
        for (const d of draftDeletes) {
            if (d.liveServiceId) await Service.findByIdAndDelete(d.liveServiceId);
            await Service.findByIdAndDelete(d._id);
        }

        // 2. Publish all draft updates/creations
        const serviceDrafts = await Service.find({ publishStatus: 'draft' });
        for (const draft of serviceDrafts) {
            if (draft.liveServiceId) {
                // Update existing live service
                const data = { ...draft.toObject() };
                delete data._id; 
                delete data.publishStatus; 
                delete data.liveServiceId;
                await Service.findByIdAndUpdate(draft.liveServiceId, data);
                await Service.findByIdAndDelete(draft._id);
            } else {
                // New service
                draft.publishStatus = 'live';
                await draft.save();
            }
        }
        
        return NextResponse.json({ success: true, message: 'Changes published successfully.' });
    } catch (error) {
        console.error('Publish All Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
