import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import Category from '@/backend/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'live';
        // Also support ?status=Active (used by partner dashboard) — treat as live
        const statusParam = searchParams.get('status');

        // If partner/frontend uses ?status=Active, return the live doc categories list
        if (statusParam) {
            const liveDoc = await Category.findOne({ status: 'live' });
            const cats = (liveDoc?.categories || []).filter(c => {
                // If category has its own status field, filter by it; otherwise include all
                return !c.status || c.status.toLowerCase() === statusParam.toLowerCase();
            });
            return NextResponse.json({
                success: true,
                categories: cats,
                sectionTitle: liveDoc?.sectionTitle || ''
            });
        }

        let doc = await Category.findOne({ status: mode });
        
        if (!doc && mode === 'draft') {
            doc = await Category.findOne({ status: 'live' });
        }
        
        return NextResponse.json({ 
            success: true, 
            categories: doc?.categories || [],
            sectionTitle: doc?.sectionTitle || ''
        });
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        
        let draft = await Category.findOne({ status: 'draft' });
        const live = await Category.findOne({ status: 'live' });
        
        let incomingCategories = body.categories !== undefined ? body.categories : (draft?.categories || live?.categories || []);
        
        // Deep merge logic to preserve nested subcategories, headlists, and services
        const existingCategories = draft?.categories || live?.categories || [];
        const categoriesToSave = incomingCategories.map(incomingCat => {
            // Find if this category already exists in our database
            const existingCat = existingCategories.find(c => 
                (c.slug && incomingCat.slug && c.slug === incomingCat.slug) || 
                (c.name && incomingCat.name && c.name === incomingCat.name)
            );
            
            if (existingCat) {
                let mergedSubcategories = incomingCat.subcategories || [];
                
                // If existing has subcategories, we should map over incoming and preserve details
                if (Array.isArray(existingCat.subcategories) && existingCat.subcategories.length > 0) {
                    if (mergedSubcategories.length === 0) {
                        mergedSubcategories = existingCat.subcategories;
                    } else {
                        mergedSubcategories = mergedSubcategories.map(incomingSub => {
                            const incomingSubName = typeof incomingSub === 'string' ? incomingSub : (incomingSub.name || '');
                            const incomingSubSlug = typeof incomingSub === 'string' ? incomingSub.toLowerCase().replace(/[^a-z0-9]+/g, '-') : (incomingSub.slug || incomingSubName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                            
                            const existingSub = existingCat.subcategories.find(s => 
                                (typeof incomingSub === 'object' && incomingSub.id && s.id && s.id === incomingSub.id) || 
                                (!(typeof incomingSub === 'object' && incomingSub.id) && ((s.slug && incomingSubSlug && s.slug === incomingSubSlug) || (s.name && incomingSubName && s.name === incomingSubName)))
                            );
                            
                            if (existingSub) {
                                return {
                                    ...(typeof incomingSub === 'object' ? incomingSub : { name: incomingSubName, slug: incomingSubSlug }),
                                    ...existingSub, // Overwrite with existing rich data
                                    name: typeof incomingSub === 'object' && incomingSub.name ? incomingSub.name : existingSub.name,
                                    slug: typeof incomingSub === 'object' && incomingSub.slug ? incomingSub.slug : existingSub.slug,
                                    icon: typeof incomingSub === 'object' && incomingSub.icon !== undefined ? incomingSub.icon : existingSub.icon,
                                    image: typeof incomingSub === 'object' && incomingSub.image !== undefined ? incomingSub.image : existingSub.image,
                                    headerInfo: existingSub.headerInfo,
                                    servicesList: existingSub.servicesList,
                                };
                            }
                            return incomingSub;
                        });
                    }
                }

                return {
                    ...incomingCat,
                    subcategories: mergedSubcategories,
                    headerInfo: incomingCat.headerInfo !== undefined ? incomingCat.headerInfo : existingCat.headerInfo,
                    servicesList: incomingCat.servicesList !== undefined ? incomingCat.servicesList : existingCat.servicesList
                };
            }
            return incomingCat;
        });
        
        let sectionTitleToSave = draft?.sectionTitle || live?.sectionTitle || 'What are you looking for?';
        if (body.sectionTitle !== undefined && body.sectionTitle !== null) {
            sectionTitleToSave = body.sectionTitle;
        }

        const updatedDraft = await Category.findOneAndUpdate(
            { status: 'draft' },
            {
                $set: {
                    categories: categoriesToSave,
                    sectionTitle: sectionTitleToSave
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ 
            success: true, 
            categories: updatedDraft.categories,
            sectionTitle: updatedDraft.sectionTitle 
        });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        
        let draft = await Category.findOne({ status: 'draft' });
        const live = await Category.findOne({ status: 'live' });
        
        let existingCategories = Array.isArray(draft?.categories) 
            ? JSON.parse(JSON.stringify(draft.categories)) 
            : (Array.isArray(live?.categories) ? JSON.parse(JSON.stringify(live.categories)) : []);
        
        const newCategory = {
            id: body.id || new mongoose.Types.ObjectId().toString(),
            name: body.name,
            slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: body.description || '',
            icon: body.icon || '',
            image: body.image || '',
            subcategories: body.subcategories || [],
            status: body.status || 'Active',
            order: body.order || 0
        };
        
        existingCategories.push(newCategory);
        
        let sectionTitleToSave = draft?.sectionTitle || live?.sectionTitle || 'What are you looking for?';

        const updatedDraft = await Category.findOneAndUpdate(
            { status: 'draft' },
            {
                $set: {
                    categories: existingCategories,
                    sectionTitle: sectionTitleToSave
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Category created successfully',
            categories: updatedDraft.categories 
        });
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
