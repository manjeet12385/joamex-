import { NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/adminAuth';
import { signJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { success, message, admin } = await verifyAdminCredentials(email, password);

    if (!success || !admin) {
      return NextResponse.json(
        { error: message || 'Unauthorized Admin Credentials' },
        { status: 401 }
      );
    }

    // Sign JWT Token
    const token = await signJWT({
      email: admin.email,
      role: 'admin',
      id: admin._id ? admin._id.toString() : 'super-admin',
    });

    const response = NextResponse.json(
      {
        message: 'Admin login successful',
        success: true,
        user: {
          fullName: admin.fullName || 'Admin User',
          email: admin.email,
          phone: admin.phone || '',
          role: 'admin',
        },
      },
      { status: 200 }
    );

    // Set Secure Cookie (30 Days persistent login)
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days persistent login
    });

    return response;
  } catch (error) {
    console.error('Admin password login error:', error);
    return NextResponse.json(
      { error: 'Admin login failed. Invalid credentials.' },
      { status: 500 }
    );
  }
}
