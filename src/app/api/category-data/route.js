import { NextResponse } from 'next/server';
import connectDB from '@/backend/config/db';
import CategoryData from '@/backend/models/CategoryData';

export async function GET(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const categoryId = url.searchParams.get('categoryId');
        
        if (!categoryId) {
            return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
        }

        const categoryData = await CategoryData.findOne({ categoryId });
        if (!categoryData) {
            return NextResponse.json({ data: null });
        }
        
        return NextResponse.json({ data: categoryData.data });
    } catch (error) {
        console.error('Error fetching category data:', error);
        return NextResponse.json({ error: 'Failed to fetch category data' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const { categoryId, data } = await req.json();
        
        if (!categoryId || !data) {
            return NextResponse.json({ error: 'categoryId and data are required' }, { status: 400 });
        }

        const updatedData = await CategoryData.findOneAndUpdate(
            { categoryId },
            { categoryId, data },
            { new: true, upsert: true }
        );
        
        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        console.error('Error saving category data:', error);
        return NextResponse.json({ error: 'Failed to save category data' }, { status: 500 });
    }
}
