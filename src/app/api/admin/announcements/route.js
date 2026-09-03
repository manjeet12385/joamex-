export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Partner from '@/models/Partner';
import { sendEmail } from '@/lib/email';
import { verifyJWT } from '@/backend/services/authService';

export async function POST(req) {
    try {
        const adminToken = req.cookies.get('admin_token')?.value;
        const verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;
        if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const { target, subject, message } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ success: false, message: 'Subject and Message content are required' }, { status: 400 });
        }

        let recipients = [];

        if (target === 'users' || target === 'all') {
            const users = await User.find({}, 'email');
            recipients.push(...users.map(u => u.email).filter(Boolean));
        }

        if (target === 'partners' || target === 'all') {
            const partners = await Partner.find({}, 'email');
            recipients.push(...partners.map(p => p.email).filter(Boolean));
        }

        // Deduplicate emails
        const uniqueRecipients = [...new Set(recipients)];

        // Send email to each recipient
        let sentCount = 0;
        for (const email of uniqueRecipients) {
            try {
                await sendEmail({
                    to: email,
                    subject: subject,
                    text: message,
                    html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #1F2937;">
                            <h2 style="color: #2563EB;">📢 ${subject}</h2>
                            <div style="background: #F8FAFC; padding: 15px; border-radius: 8px; border: 1px solid #E2E8F0; font-size: 1rem; line-height: 1.6;">
                                ${message.replace(/\n/g, '<br/>')}
                            </div>
                            <p style="color: #6B7280; font-size: 0.85rem; margin-top: 20px;">Sent via Joamex Service Platform</p>
                        </div>`
                });
                sentCount++;
            } catch (err) {
                console.warn(`Failed to send broadcast email to ${email}:`, err.message);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Broadcast announcement dispatched to ${sentCount} recipient(s)!`,
            sentCount
        });

    } catch (error) {
        console.error('Broadcast Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
