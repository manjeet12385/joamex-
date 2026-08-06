import { NextResponse } from 'next/server';
import connectToDatabase from '@/backend/config/db';
import Category from '@/models/Category';
import mongoose from 'mongoose';

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
        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findById(id);
        }
        if (!category) {
            category = await Category.findOne({ $or: [{ slug: id }, { name: id }] });
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

        let category = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findById(id);
        }
        if (!category) {
            category = await Category.findOne({ $or: [{ slug: id }, { name: id }] });
        }

        if (!category) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        const body = await req.json();
        const { name, slug, description, icon, image, subcategories, status, order } = body;

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

        if (subcategories !== undefined) {
            category.subcategories = Array.isArray(subcategories)
                ? subcategories.map(s => String(s).trim()).filter(Boolean)
                : (typeof subcategories === 'string' ? subcategories.split(',').map(s => s.trim()).filter(Boolean) : []);
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

        let category = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
            category = await Category.findByIdAndDelete(id);
        }
        if (!category) {
            category = await Category.findOneAndDelete({ $or: [{ slug: id }, { name: id }] });
        }

        if (!category) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Category "${category.name}" deleted successfully`
        });

    } catch (error) {
        console.error('DELETE /api/admin/categories/[id] error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
