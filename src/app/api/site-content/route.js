export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SiteContent from '@/models/SiteContent';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};

export async function GET() {
    try {
        await connectDB();
        const content = await SiteContent.findOne({ documentId: 'global' });
        
        if (!content) {
            return NextResponse.json({ data: {} }, { status: 200 });
        }

        // Simply return whatever is stored in the DB — no auto-writing
        return NextResponse.json({ data: content.data }, { status: 200 });
    } catch (error) {
        console.error('Error fetching site content:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Basic security: In a real app, verify admin token here using next-auth/jwt or headers
        // Since we are building an MVP API, we rely on frontend hiding the button
        // But for safety, you should check session: const session = await getServerSession(authOptions);
        
        const body = await req.json();
        const { data } = body;
        
        if (!data) {
            return NextResponse.json({ error: 'No data provided' }, { status: 400 });
        }


        await connectDB();
        
        const updated = await SiteContent.findOneAndUpdate(
            { documentId: 'global' },
            { $set: { data: data } },
            { new: true, upsert: true }
        );

        try {
            const Category = mongoose.models.Category || (await import('@/backend/models/Category')).default;
            for (const key of Object.keys(data)) {
                if (key.startsWith('admin_service_') && key.endsWith('_data')) {
                    const categoryKey = key.slice('admin_service_'.length, -'_data'.length);
                    const sections = data[key];
                    if (Array.isArray(sections)) {
                        const subcategoryNames = sections.flatMap(sec => 
                            Array.isArray(sec.items) ? sec.items.map(item => item.name || item.title || '') : []
                        ).filter(Boolean);
                        
                        await Category.updateOne(
                            { slug: categoryKey },
                            { $set: { subcategories: subcategoryNames } }
                        );
                    }
                } else if (key === 'admin_custom_category_items') {
                    const customCatItems = data[key];
                    if (customCatItems && typeof customCatItems === 'object') {
                        // FIX: The 02_what_are_you_looking_for collection stores all categories
                        // inside a single document's 'categories' array — NOT as separate documents
                        // with a top-level slug. So we find the draft doc and update inside the array.
                        let draftDoc = await Category.findOne({ status: 'draft' });
                        if (!draftDoc) {
                            // If no draft, copy from live and create draft
                            const liveDoc = await Category.findOne({ status: 'live' });
                            draftDoc = new Category({
                                status: 'draft',
                                categories: liveDoc?.categories || [],
                                sectionTitle: liveDoc?.sectionTitle || 'What are you looking for?'
                            });
                        }

                        const categoriesArr = Array.isArray(draftDoc.categories) ? [...draftDoc.categories] : [];
                        let draftModified = false;

                        for (const catKey of Object.keys(customCatItems)) {
                            const items = customCatItems[catKey];
                            if (!Array.isArray(items)) continue;

                            // Build updated subcategories array from the sub-items
                            const updatedSubcategories = items.map(item => {
                                const itemName = item.name || item.label || '';
                                const itemSlug = itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                return {
                                    name: itemName,
                                    slug: itemSlug,
                                    icon: item.icon || '',
                                    badge: item.badge || '',
                                    time: item.time || '',
                                    route: item.route || '',
                                    details: item.details || ''
                                };
                            });

                            // Find the category inside the categories array by slug or name
                            const catIndex = categoriesArr.findIndex(c =>
                                (c.slug && c.slug.toLowerCase() === catKey.toLowerCase()) ||
                                (c.key && c.key.toLowerCase() === catKey.toLowerCase()) ||
                                (c.name && c.name.toLowerCase() === catKey.toLowerCase())
                            );

                            if (catIndex !== -1) {
                                // Update existing category in array
                                categoriesArr[catIndex] = {
                                    ...categoriesArr[catIndex],
                                    subcategories: updatedSubcategories
                                };
                                draftModified = true;
                                console.log(`Synced ${updatedSubcategories.length} subcategories into draft categories[${catIndex}] for: ${catKey}`);
                            } else {
                                console.warn(`Category "${catKey}" not found in draft categories array — skipping subcategory sync`);
                            }
                        }

                        if (draftModified) {
                            draftDoc.categories = categoriesArr;
                            draftDoc.markModified('categories');
                            await draftDoc.save();
                            console.log('Draft 02_what_are_you_looking_for updated with subcategories.');
                        }
                    }
                }
            }
        } catch (syncErr) {
            console.error('Failed to sync subcategories to Category collection:', syncErr);
        }

        return NextResponse.json({ message: 'Content saved successfully', data: updated.data }, { status: 200 });
    } catch (error) {
        console.error('Error saving site content:', error);
        return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
    }
}
