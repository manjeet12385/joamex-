import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
    {
        name: 'AC & Appliance Repair',
        slug: 'ac-appliance-repair',
        description: 'AC, Washing machine, Refrigerator, Microwave, and home appliances repair & service.',
        icon: '❄️',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
        subcategories: ['AC Repair & Service', 'Washing Machine Repair', 'Refrigerator Repair', 'Microwave Repair', 'Water Purifier Service'],
        status: 'Active',
        order: 1
    },
    {
        name: 'Electrician & Plumber',
        slug: 'electrician-plumber',
        description: 'Professional electrical wiring, switch board installation, plumbing repairs and leak fixes.',
        icon: '⚡',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
        subcategories: ['Switch & Socket', 'Wiring & MCB', 'Tap & Mixer Repair', 'Toilet & Sink Repair', 'Water Tank Cleaning'],
        status: 'Active',
        order: 2
    },
    {
        name: 'Home Cleaning & Pest Control',
        slug: 'cleaning-pest-control',
        description: 'Deep home cleaning, bathroom cleaning, kitchen deep clean, and pest extermination.',
        icon: '🧹',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
        subcategories: ['Full Home Cleaning', 'Bathroom Deep Clean', 'Kitchen Deep Clean', 'Cockroach Control', 'Termite Control'],
        status: 'Active',
        order: 3
    },
    {
        name: 'Renovation & Interior',
        slug: 'renovation-interior',
        description: 'Home painting, woodwork, carpentry, false ceiling, and interior remodeling.',
        icon: '🎨',
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
        subcategories: ['Wall Painting', 'Waterproofing', 'Furniture Assembly', 'Custom Carpentry', 'False Ceiling'],
        status: 'Active',
        order: 4
    },
    {
        name: 'Fabrication & Roofing',
        slug: 'fabrication-roofing',
        description: 'Iron railing, gate fabrication, shed construction, metal welding and roofing work.',
        icon: '🛠️',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=400&h=300&fit=crop',
        subcategories: ['Gate & Railing Repair', 'Metal Welding', 'Shed Roofing', 'Safety Grills'],
        status: 'Active',
        order: 5
    },
    {
        name: 'Women\'s Beauty & Spa',
        slug: 'beauty-spa',
        description: 'At-home salon, waxing, facial, manicure, pedicure and hair styling for women.',
        icon: '💅',
        image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop',
        subcategories: ['Facial & Cleanup', 'Waxing', 'Manicure & Pedicure', 'Hair Care & Color', 'Bridal Makeup'],
        status: 'Active',
        order: 6
    },
    {
        name: 'Men\'s Grooming',
        slug: 'mens-grooming',
        description: 'At-home haircut, beard styling, head massage, facial and hair coloring for men.',
        icon: '✂️',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
        subcategories: ['Haircut', 'Beard Grooming', 'Facial & Scrub', 'Head Massage'],
        status: 'Active',
        order: 7
    },
    {
        name: 'Home Security & Solar',
        slug: 'security-solar',
        description: 'CCTV installation, smart locks, solar panel rooftop installation and maintenance.',
        icon: '☀️',
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&h=300&fit=crop',
        subcategories: ['CCTV Camera Setup', 'Smart Door Locks', 'Rooftop Solar Installation', 'Solar Water Heater'],
        status: 'Active',
        order: 8
    }
];

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'All';

        let totalInDb = await Category.countDocuments({});

        // Auto seed default categories if DB is empty
        if (totalInDb === 0) {
            await Category.insertMany(DEFAULT_CATEGORIES);
            totalInDb = DEFAULT_CATEGORIES.length;
        }

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { subcategories: { $regex: search, $options: 'i' } }
            ];
        }

        if (status !== 'All') {
            query.status = status;
        }

        const categories = await Category.find(query).sort({ order: 1, createdAt: -1 });

        const activeCount = await Category.countDocuments({ status: 'Active' });
        const inactiveCount = await Category.countDocuments({ status: 'Inactive' });
        
        let totalSubcategories = 0;
        const allCats = await Category.find({});
        allCats.forEach(c => {
            if (Array.isArray(c.subcategories)) {
                totalSubcategories += c.subcategories.length;
            }
        });

        return NextResponse.json({
            success: true,
            categories,
            stats: {
                totalCategories: totalInDb,
                activeCategories: activeCount,
                inactiveCategories: inactiveCount,
                totalSubcategories
            }
        });

    } catch (error) {
        console.error('GET /api/admin/categories error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

import { verifyJWT } from '@/backend/services/authService';

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const { name, slug, description, icon, image, subcategories, status, order } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
        }

        // Check duplicate name
        const existing = await Category.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
        if (existing) {
            return NextResponse.json({ success: false, message: `Category "${name}" already exists` }, { status: 400 });
        }

        const generatedSlug = slug ? slug.trim().toLowerCase() : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const subcatsArray = Array.isArray(subcategories)
            ? subcategories.map(s => String(s).trim()).filter(Boolean)
            : (typeof subcategories === 'string' ? subcategories.split(',').map(s => s.trim()).filter(Boolean) : []);

        const newCategory = new Category({
            name: name.trim(),
            slug: generatedSlug,
            description: description ? description.trim() : '',
            icon: icon || '📁',
            image: image || '',
            subcategories: subcatsArray,
            status: status || 'Active',
            order: order ? Number(order) : 0
        });

        await newCategory.save();

        return NextResponse.json({
            success: true,
            message: 'Category created successfully',
            category: newCategory
        }, { status: 201 });

    } catch (error) {
        console.error('POST /api/admin/categories error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
