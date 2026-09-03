import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import Category from '@/models/Category';
import mongoose from 'mongoose';

// Import all UI component models for cascading unlink
import FeatureBanner from '@/backend/models/FeatureBanner';
import ExclusiveOffer from '@/backend/models/ExclusiveOffer';
import EssentialService from '@/backend/models/EssentialService';
import HomeRenovation from '@/backend/models/HomeRenovation';
import SolarWaterSolution from '@/backend/models/SolarWaterSolution';
import MostBookedService from '@/backend/models/MostBookedService';
import DownBanner1 from '@/backend/models/DownBanner1';
import DownBanner2 from '@/backend/models/DownBanner2';
import HeroBanner from '@/backend/models/HeroBanner';
import Partner from '@/backend/models/Partner';

export const dynamic = 'force-dynamic';

// GET Single Category
export async function GET(req, { params }) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const id = resolvedParams?.id;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
        }

        let category = null;
        let parentCategory = null;
        const normalizedSlug = id.toLowerCase().trim();

        // Step 1: Try by ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findById(id);
        }
        // Step 2: Try top-level slug/name on any document
        if (!category) {
            category = await Category.findOne({ $or: [{ slug: id }, { name: id }] });
        }

        // Step 3: Check if it's a subcategory inside a top-level subcategories[] array
        if (!category) {
            parentCategory = await Category.findOne({
                $or: [
                    { "subcategories.slug": normalizedSlug },
                    { "subcategories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                ]
            });
            if (parentCategory) {
                const sub = parentCategory.subcategories.find(s =>
                    s && (s.slug === normalizedSlug ||
                        (typeof s === 'object' && s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug) ||
                        (typeof s === 'string' && s.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug))
                );
                if (sub) {
                    category = {
                        _id: parentCategory._id,
                        name: typeof sub === 'object' ? sub.name : sub,
                        slug: normalizedSlug,
                        headerInfo: typeof sub === 'object' ? sub.headerInfo : null,
                        servicesList: typeof sub === 'object' ? sub.servicesList : null,
                        isSubcategory: true,
                        parentSlug: parentCategory.slug
                    };
                }
            }
        }

        // Step 4 (KEY FIX): Check inside the categories[].subcategories[] array of 02_what_are_you_looking_for documents
        if (!category) {
            const lookingForDoc = await Category.findOne({
                status: 'live',
                $or: [
                    { "categories.subcategories.slug": normalizedSlug },
                    { "categories.subcategories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                ]
            });
            if (lookingForDoc && Array.isArray(lookingForDoc.categories)) {
                for (const cat of lookingForDoc.categories) {
                    if (Array.isArray(cat.subcategories)) {
                        const subItem = cat.subcategories.find(s => 
                            s && (
                                (s.slug && s.slug.toLowerCase() === normalizedSlug) ||
                                (s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug)
                            )
                        );
                        if (subItem) {
                            category = {
                                _id: lookingForDoc._id,
                                name: subItem.name || normalizedSlug,
                                slug: normalizedSlug,
                                headerInfo: subItem.headerInfo || null,
                                servicesList: subItem.servicesList || null,
                                isWhatAreYouLookingForSubcategory: true,
                                parentSlug: cat.slug || cat.key,
                                docStatus: lookingForDoc.status
                            };
                            console.log(`[GET] Found subcategory "${normalizedSlug}" inside categories[${cat.slug || cat.name}] of ${lookingForDoc.status} doc`);
                            break;
                        }
                    }
                }
            }
        }

        // Step 5: Check inside the categories[] array of 02_what_are_you_looking_for documents
        // e.g. { categories: [{ slug: 'painter', subcategories: [...] }] }
        if (!category) {
            const lookingForDoc = await Category.findOne({
                status: 'live',
                $or: [
                    { "categories.slug": normalizedSlug },
                    { "categories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                ]
            });
            if (lookingForDoc && Array.isArray(lookingForDoc.categories)) {
                const catItem = lookingForDoc.categories.find(c =>
                    c && (
                        (c.slug && c.slug.toLowerCase() === normalizedSlug) ||
                        (c.key && c.key.toLowerCase() === normalizedSlug) ||
                        (c.name && c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug)
                    )
                );
                if (catItem) {
                    category = {
                        _id: lookingForDoc._id,
                        name: catItem.name || catItem.label || normalizedSlug,
                        slug: normalizedSlug,
                        headerInfo: catItem.headerInfo || null,
                        servicesList: catItem.servicesList || null,
                        isWhatAreYouLookingFor: true,  // marker so PUT knows where to save
                        docStatus: lookingForDoc.status
                    };
                    console.log(`[GET] Found "${normalizedSlug}" inside categories[] of ${lookingForDoc.status} doc`);
                }
            }
        }

        if (!category) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, category });


    } catch (error) {
        console.error('GET /api/admin/categories/[id] error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT / Update Category
export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const id = resolvedParams?.id;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
        }

        const body = await req.json();
        const { name, slug, description, icon, image, subcategories, status, order, headerInfo, servicesList } = body;

        let category = null;
        let parentCategory = null;
        let subIndex = -1;
        const normalizedSlug = id.toLowerCase().trim();

        // Step 1: Try by ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findById(id);
        }
        // Step 2: Try top-level slug/name
        if (!category) {
            category = await Category.findOne({ $or: [{ slug: id }, { name: id }] });
        }

        // Step 3: Check top-level subcategories[] array (prefer draft)
        if (!category) {
            parentCategory = await Category.findOne({
                status: 'draft',
                $or: [
                    { "subcategories.slug": normalizedSlug },
                    { "subcategories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                ]
            });
            if (!parentCategory) {
                // Look in live — if found, create a draft copy first
                const liveParent = await Category.findOne({
                    status: 'live',
                    $or: [
                        { "subcategories.slug": normalizedSlug },
                        { "subcategories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                    ]
                });
                if (liveParent) {
                    let draft = await Category.findOne({ status: 'draft' });
                    if (!draft) {
                        draft = new Category({
                            status: 'draft',
                            sectionTitle: liveParent.sectionTitle,
                            categories: JSON.parse(JSON.stringify(liveParent.categories || []))
                        });
                        await draft.save();
                    }
                    parentCategory = await Category.findOne({
                        status: 'draft',
                        $or: [
                            { "subcategories.slug": normalizedSlug },
                            { "subcategories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                        ]
                    });
                }
            }
            if (parentCategory) {
                subIndex = parentCategory.subcategories.findIndex(s =>
                    s && (s.slug === normalizedSlug ||
                        (typeof s === 'object' && s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug) ||
                        (typeof s === 'string' && s.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug))
                );
            }
        }

        // If it is a nested subcategory update (Step 3 match)
        if (parentCategory && subIndex !== -1) {
            let currentSub = parentCategory.subcategories[subIndex];
            if (typeof currentSub === 'string') {
                currentSub = { name: currentSub, slug: normalizedSlug };
            }
            if (headerInfo !== undefined) currentSub.headerInfo = headerInfo;
            if (servicesList !== undefined) currentSub.servicesList = servicesList;
            if (name !== undefined) currentSub.name = name;
            currentSub.slug = normalizedSlug;

            parentCategory.subcategories[subIndex] = currentSub;
            parentCategory.markModified('subcategories');
            await parentCategory.save();

            return NextResponse.json({
                success: true,
                message: 'Subcategory updated inside parent category successfully',
                category: {
                    _id: parentCategory._id,
                    name: currentSub.name,
                    slug: currentSub.slug,
                    headerInfo: currentSub.headerInfo,
                    servicesList: currentSub.servicesList,
                    isSubcategory: true
                }
            });
        }

        // Step 4 (KEY FIX): Search inside categories[].subcategories[] array of 02_what_are_you_looking_for docs
        if (!category) {
            let lookingForDoc = await Category.findOne({
                status: 'draft',
                $or: [
                    { "categories.subcategories.slug": normalizedSlug },
                    { "categories.subcategories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                ]
            });
            if (!lookingForDoc) {
                // No draft found (or draft doesn't have it) — look in live
                const liveDoc = await Category.findOne({
                    status: 'live',
                    $or: [
                        { "categories.subcategories.slug": normalizedSlug },
                        { "categories.subcategories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                    ]
                });
                if (liveDoc) {
                    let existingDraft = await Category.findOne({ status: 'draft' });
                    if (!existingDraft) {
                        existingDraft = new Category({
                            status: 'draft',
                            sectionTitle: liveDoc.sectionTitle,
                            categories: JSON.parse(JSON.stringify(liveDoc.categories || []))
                        });
                        await existingDraft.save();
                        lookingForDoc = existingDraft;
                    } else {
                        // Draft exists but lacks the subcategory. We need to copy it from liveDoc.
                        const liveCatIndex = liveDoc.categories.findIndex(cat => 
                            Array.isArray(cat.subcategories) && cat.subcategories.some(s => 
                                s && (
                                    (s.slug && s.slug.toLowerCase() === normalizedSlug) ||
                                    (s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug)
                                )
                            )
                        );
                        
                        if (liveCatIndex !== -1) {
                            const liveCat = liveDoc.categories[liveCatIndex];
                            const liveSub = liveCat.subcategories.find(s => 
                                s && (
                                    (s.slug && s.slug.toLowerCase() === normalizedSlug) ||
                                    (s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug)
                                )
                            );
                            
                            const draftCatIndex = existingDraft.categories.findIndex(c => c.slug === liveCat.slug || c.name === liveCat.name);
                            if (draftCatIndex !== -1) {
                                if (!Array.isArray(existingDraft.categories[draftCatIndex].subcategories)) {
                                    existingDraft.categories[draftCatIndex].subcategories = [];
                                }
                                existingDraft.categories[draftCatIndex].subcategories.push(liveSub);
                            } else {
                                existingDraft.categories.push(liveCat);
                            }
                            existingDraft.markModified('categories');
                            await existingDraft.save();
                        }
                        lookingForDoc = existingDraft;
                    }
                }
            }

            if (lookingForDoc && Array.isArray(lookingForDoc.categories)) {
                let foundCatIndex = -1;
                let foundSubIndex = -1;

                for (let i = 0; i < lookingForDoc.categories.length; i++) {
                    const cat = lookingForDoc.categories[i];
                    if (Array.isArray(cat.subcategories)) {
                        const sIdx = cat.subcategories.findIndex(s => 
                            s && (
                                (s.slug && s.slug.toLowerCase() === normalizedSlug) ||
                                (s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug)
                            )
                        );
                        if (sIdx !== -1) {
                            foundCatIndex = i;
                            foundSubIndex = sIdx;
                            break;
                        }
                    }
                }

                if (foundCatIndex !== -1 && foundSubIndex !== -1) {
                    const catItem = { ...lookingForDoc.categories[foundCatIndex] };
                    const subItem = { ...catItem.subcategories[foundSubIndex] };

                    if (headerInfo !== undefined) subItem.headerInfo = headerInfo;
                    if (servicesList !== undefined) subItem.servicesList = servicesList;
                    if (name !== undefined) subItem.name = name;

                    catItem.subcategories[foundSubIndex] = subItem;
                    lookingForDoc.categories[foundCatIndex] = catItem;
                    lookingForDoc.markModified('categories');
                    await lookingForDoc.save();

                    console.log(`[PUT] Saved headerInfo/servicesList into subcategory "${normalizedSlug}" of ${lookingForDoc.status} doc`);

                    return NextResponse.json({
                        success: true,
                        message: 'Subcategory updated in 02_what_are_you_looking_for successfully',
                        category: {
                            _id: lookingForDoc._id,
                            name: subItem.name || normalizedSlug,
                            slug: normalizedSlug,
                            headerInfo: subItem.headerInfo || null,
                            servicesList: subItem.servicesList || null,
                            isWhatAreYouLookingForSubcategory: true
                        }
                    });
                }
            }
        }

        // Step 5: Search inside categories[] array of 02_what_are_you_looking_for docs
        // This handles the case where e.g. 'painter' is an item inside the categories array,
        // not a separate top-level document.
        if (!category) {
            // Prefer draft doc so edits go to draft
            let lookingForDoc = await Category.findOne({
                status: 'draft',
                $or: [
                    { "categories.slug": normalizedSlug },
                    { "categories.key": normalizedSlug },
                    { "categories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                ]
            });
            if (!lookingForDoc) {
                // No draft found (or lacks category) — look in live
                const liveDoc = await Category.findOne({
                    status: 'live',
                    $or: [
                        { "categories.slug": normalizedSlug },
                        { "categories.key": normalizedSlug },
                        { "categories.name": { $regex: `^${normalizedSlug.replace(/-/g, ' ')}$`, $options: 'i' } }
                    ]
                });
                if (liveDoc) {
                    let existingDraft = await Category.findOne({ status: 'draft' });
                    if (!existingDraft) {
                        existingDraft = new Category({
                            status: 'draft',
                            sectionTitle: liveDoc.sectionTitle,
                            categories: JSON.parse(JSON.stringify(liveDoc.categories || []))
                        });
                        await existingDraft.save();
                        lookingForDoc = existingDraft;
                    } else {
                        // Draft exists but lacks category. Copy it from liveDoc.
                        const liveCatIndex = liveDoc.categories.findIndex(c =>
                            c && (
                                (c.slug && c.slug.toLowerCase() === normalizedSlug) ||
                                (c.key && c.key.toLowerCase() === normalizedSlug) ||
                                (c.name && c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug)
                            )
                        );
                        if (liveCatIndex !== -1) {
                            const liveCat = liveDoc.categories[liveCatIndex];
                            existingDraft.categories.push(liveCat);
                            existingDraft.markModified('categories');
                            await existingDraft.save();
                        }
                        lookingForDoc = existingDraft;
                    }
                }
            }

            if (lookingForDoc && Array.isArray(lookingForDoc.categories)) {
                const catIndex = lookingForDoc.categories.findIndex(c =>
                    c && (
                        (c.slug && c.slug.toLowerCase() === normalizedSlug) ||
                        (c.key && c.key.toLowerCase() === normalizedSlug) ||
                        (c.name && c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug)
                    )
                );

                if (catIndex !== -1) {
                    const catItem = { ...lookingForDoc.categories[catIndex] };

                    if (headerInfo !== undefined) catItem.headerInfo = headerInfo;
                    if (servicesList !== undefined) catItem.servicesList = servicesList;
                    if (name !== undefined) catItem.name = name;

                    lookingForDoc.categories[catIndex] = catItem;
                    lookingForDoc.markModified('categories');
                    await lookingForDoc.save();

                    console.log(`[PUT] Saved headerInfo/servicesList into categories[${catIndex}] ("${normalizedSlug}") of ${lookingForDoc.status} doc`);

                    return NextResponse.json({
                        success: true,
                        message: 'Category updated in 02_what_are_you_looking_for successfully',
                        category: {
                            _id: lookingForDoc._id,
                            name: catItem.name || catItem.label || normalizedSlug,
                            slug: normalizedSlug,
                            headerInfo: catItem.headerInfo || null,
                            servicesList: catItem.servicesList || null,
                            isWhatAreYouLookingFor: true
                        }
                    });
                }
            }
        }

        // Standard Main Category create or update (fallback)
        if (!category) {
            category = new Category({
                name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                slug: id.toLowerCase(),
                isSubcategory: true
            });
        }

        if (name && name.trim()) {
            const existing = await Category.findOne({
                _id: { $ne: category._id },
                name: { $regex: `^${name.trim()}$`, $options: 'i' }
            });
            if (existing) {
                return NextResponse.json({ success: false, message: `Category "${name}" already exists` }, { status: 400 });
            }
            category.name = name.trim();
        }

        if (slug !== undefined) {
            category.slug = slug.trim().toLowerCase();
        } else if (name) {
            category.slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        if (description !== undefined) category.description = description.trim();
        if (icon !== undefined) category.icon = icon;
        if (image !== undefined) category.image = image;
        if (status !== undefined) category.status = status;
        if (order !== undefined) category.order = Number(order);

        if (headerInfo !== undefined) category.headerInfo = headerInfo;
        if (servicesList !== undefined) {
            category.servicesList = servicesList;
            
            // Auto-populate flat subcategories array from packages
            if (Array.isArray(servicesList)) {
                const subcategoryNames = servicesList.flatMap(sec => 
                    Array.isArray(sec.items) ? sec.items.map(item => item.name || item.title || '') : []
                ).filter(Boolean);
                category.subcategories = subcategoryNames;
            }
        } else if (subcategories !== undefined) {
            const rawSubs = Array.isArray(subcategories)
                ? subcategories
                : (typeof subcategories === 'string' ? subcategories.split(',').map(s => s.trim()).filter(Boolean) : []);
            
            const existingList = Array.isArray(category.subcategories) ? category.subcategories : [];

            category.subcategories = rawSubs.map(s => {
                const sName = typeof s === 'string' ? s.trim() : (s.name || '');
                const sSlug = sName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const existing = existingList.find(ex => ex && (ex.slug === sSlug || (typeof ex === 'object' && ex.name === sName)));
                if (existing && typeof existing === 'object') {
                    return { ...existing, name: sName };
                }
                return typeof s === 'object' ? s : { name: sName, slug: sSlug };
            });
            category.markModified('subcategories');
        }

        await category.save();

        return NextResponse.json({
            success: true,
            message: 'Category updated successfully',
            category
        });

    } catch (error) {
        console.error('PUT /api/admin/categories/[id] error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE Category
export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const id = resolvedParams?.id;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
        }

        const normalizedSlug = id.toLowerCase().trim();
        let deletedItemName = normalizedSlug;

        // Fetch or create draft document
        let draftDoc = await Category.findOne({ status: 'draft' });
        const liveDoc = await Category.findOne({ status: 'live' });

        if (!draftDoc && liveDoc) {
            draftDoc = new Category({
                status: 'draft',
                sectionTitle: liveDoc.sectionTitle,
                categories: JSON.parse(JSON.stringify(liveDoc.categories || []))
            });
            await draftDoc.save();
        }

        if (!draftDoc || !Array.isArray(draftDoc.categories)) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        let foundAndDeleted = false;

        // 1. Try to find and delete a top-level category
        const catIndex = draftDoc.categories.findIndex(c =>
            c && (
                (c.slug && c.slug.toLowerCase() === normalizedSlug) ||
                (c.key && c.key.toLowerCase() === normalizedSlug) ||
                (c.name && c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug) ||
                (c.id && String(c.id) === id) ||
                (c._id && String(c._id) === id)
            )
        );

        if (catIndex !== -1) {
            deletedItemName = draftDoc.categories[catIndex].name || draftDoc.categories[catIndex].label || normalizedSlug;
            draftDoc.categories.splice(catIndex, 1);
            foundAndDeleted = true;
        } else {
            // 2. If not top-level, try to find and delete a subcategory inside a category
            for (let i = 0; i < draftDoc.categories.length; i++) {
                const cat = draftDoc.categories[i];
                if (Array.isArray(cat.subcategories)) {
                    const subIndex = cat.subcategories.findIndex(s =>
                        s && (
                            (s.slug && s.slug.toLowerCase() === normalizedSlug) ||
                            (s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug) ||
                            (s.id && String(s.id) === id) ||
                            (s._id && String(s._id) === id)
                        )
                    );
                    if (subIndex !== -1) {
                        deletedItemName = cat.subcategories[subIndex].name || normalizedSlug;
                        cat.subcategories.splice(subIndex, 1);
                        foundAndDeleted = true;
                        break;
                    }
                }
            }
        }

        if (!foundAndDeleted) {
            return NextResponse.json({ success: false, message: 'Category or Subcategory not found in draft' }, { status: 404 });
        }

        draftDoc.markModified('categories');
        await draftDoc.save();

        return NextResponse.json({
            success: true,
            message: `"${deletedItemName}" deleted successfully (saved to draft)`
        });

    } catch (error) {
        console.error('DELETE /api/admin/categories/[id] error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
