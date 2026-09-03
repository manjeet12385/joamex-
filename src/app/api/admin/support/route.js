export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SupportTicket from '@/backend/models/SupportTicket';
import { verifyJWT } from '@/lib/auth';

// Helper to check admin authorization
async function checkAuth(req) {
    const adminToken = req.cookies.get('admin_token')?.value;
    if (!adminToken) return false;
    const payload = await verifyJWT(adminToken);
    return payload && payload.email ? true : false;
}

export async function GET(req) {
    try {
        await connectToDatabase();
        const tickets = await SupportTicket.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, tickets });
    } catch (error) {
        console.error('Fetch Tickets Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST endpoint: Admin adds a reply
export async function POST(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { ticketId, message } = await req.json();

        if (!ticketId || !message) {
            return NextResponse.json({ success: false, message: 'Ticket ID and Message are required' }, { status: 400 });
        }

        const ticket = await SupportTicket.findOne({ ticketId });
        if (!ticket) {
            return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
        }

        ticket.messages.push({
            sender: 'Admin',
            message: message.trim(),
            timestamp: new Date()
        });

        // Set status to In Progress when admin replies
        if (ticket.status === 'Open') {
            ticket.status = 'In Progress';
        }

        await ticket.save();

        return NextResponse.json({ success: true, message: 'Reply sent successfully', ticket });
    } catch (error) {
        console.error('Reply Support Ticket Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH endpoint: Update ticket status
export async function PATCH(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { id, status, priority } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Ticket ID is required' }, { status: 400 });
        }

        const ticket = await SupportTicket.findById(id);
        if (!ticket) {
            return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
        }

        if (status !== undefined) ticket.status = status;
        if (priority !== undefined) ticket.priority = priority;

        await ticket.save();

        return NextResponse.json({ success: true, message: 'Ticket updated successfully', ticket });
    } catch (error) {
        console.error('Update Support Ticket Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE endpoint: Delete a ticket
export async function DELETE(req) {
    try {
        if (!(await checkAuth(req))) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Ticket ID is required' }, { status: 400 });
        }

        await SupportTicket.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Delete Support Ticket Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
