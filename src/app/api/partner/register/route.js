export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';
import EmailOtp from '@/models/EmailOtp';
import fs from 'fs';
import path from 'path';

const saveImage = (base64String, fileName) => {
    if (!base64String || !base64String.startsWith('data:image')) return base64String;

    try {
        const base64Data = base64String.split(';base64,').pop();
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'partners');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });

        return `/uploads/partners/${fileName}`;
    } catch (err) {
        console.warn('Filesystem is read-only, storing base64 directly:', err.message);
        return base64String;
    }
};

export async function POST(req) {
    try {
        await connectToDatabase();
        const data = await req.json();

        const {
            fullName,
            email,
            phoneNumber,
            experience,
            serviceCategory,
            idCardFront,
            idCardBack,
            professionalLicense,
            // Bank details
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode
        } = data;

        // Verify that email was verified
        const emailOtpRecord = await EmailOtp.findOne({ email, verified: true });
        if (!emailOtpRecord) {
            return NextResponse.json({
                success: false,
                message: 'Email address not verified. Please verify your email address first.'
            }, { status: 400 });
        }

        // Save Images
        const ts = Date.now();
        const idFrontUrl = saveImage(idCardFront, `id_front_${ts}.jpg`);
        const idBackUrl = saveImage(idCardBack, `id_back_${ts}.jpg`);
        const licenseUrl = saveImage(professionalLicense, `license_${ts}.jpg`);

        // Create Partner (phone number is saved in DB directly)
        const newPartner = await Partner.create({
            fullName,
            email,
            phoneNumber,
            experience,
            serviceCategory,
            isPhoneVerified: false,
            status: 'Pending',
            idCardFront: idFrontUrl,
            idCardBack: idBackUrl,
            professionalLicense: licenseUrl,
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode,
        });

        // Cleanup Email OTP
        await EmailOtp.deleteOne({ email });

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully',
            partnerId: newPartner._id
        });

    } catch (error) {
        console.error('Partner Registration Error:', error);

        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json({
                success: false,
                message: `${field} is already registered.`
            }, { status: 400 });
        }

        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
