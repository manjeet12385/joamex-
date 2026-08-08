import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { verifyJWT } from '@/backend/services/authService';

export async function GET(req) {
    try {
        await connectToDatabase();
        const categories = await Category.find({}).sort({ createdAt: -1 });

        // Fallback default service categories if DB is empty
        const defaultCategories = [
            { _id: 'c1', name: 'Plumbing', price: 299, icon: '⚡', description: 'Tap repair, pipe leaks, bathroom fitting', status: 'Active' },
            { _id: 'c2', name: 'Electrical', price: 199, icon: '🔧', description: 'Wiring, switchboard, fan repair', status: 'Active' },
            { _id: 'c3', name: 'Cleaning', price: 499, icon: '🧹', description: 'Home deep cleaning, sofa & carpet cleaning', status: 'Active' },
            { _id: 'c4', name: 'Carpentry', price: 349, icon: '🔨', description: 'Furniture repair, door latch, woodwork', status: 'Active' },
            { _id: 'c5', name: 'Painting', price: 999, icon: '🖌️', description: 'Full home painting, wall touchups', status: 'Active' },
            { _id: 'c6', name: 'HVAC / AC', price: 599, icon: '❄️', description: 'AC servicing, gas charging, installation', status: 'Active' }
        ];

        return NextResponse.json({
            success: true,
            categories: categories.length > 0 ? categories : defaultCategories
        });
    } catch (error) {
        console.error('Fetch Services Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { id, name, price, icon, description, status } = await req.json();

        if (!name || !price) {
            return NextResponse.json({ success: false, message: 'Service name and price are required' }, { status: 400 });
        }

        let category;
        if (id && id.length === 24) {
            category = await Category.findByIdAndUpdate(
                id,
                { name, price: Number(price), icon, description, status: status || 'Active' },
                { new: true }
            );
        } else {
            category = await Category.create({
                name,
                price: Number(price),
                icon: icon || '🛠️',
                description: description || '',
                status: status || 'Active'
            });
        }

        return NextResponse.json({
            success: true,
            message: `Service "${name}" saved successfully!`,
            category
        });

    } catch (error) {
        console.error('Save Service Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
