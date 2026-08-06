import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export const SUPER_ADMIN_EMAIL = 'vonexperts@gmail.com';
export const SUPER_ADMIN_PASSWORD_PLAIN = 'Tirumala@5';
export const SUPER_ADMIN_PHONE = '9014380344';
export const SUPER_ADMIN_NAME = 'venkanna kelothu';

export async function ensureSuperAdmin() {
  await connectToDatabase();
  const normalizedEmail = SUPER_ADMIN_EMAIL.toLowerCase();

  let admin = await Admin.findOne({ email: normalizedEmail });
  const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD_PLAIN, 10);

  if (!admin) {
    admin = await Admin.create({
      email: normalizedEmail,
      fullName: 'Venkanna Kelothu',
      phone: '9014380344',
      password: hashedPassword,
      role: 'admin',
      twoFactorEnabled: true,
    });
    console.log('✅ [ADMIN SEED] Super admin created:', normalizedEmail);
  } else {
    let updated = false;
    if (admin.fullName !== 'Venkanna Kelothu') {
      admin.fullName = 'Venkanna Kelothu';
      updated = true;
    }
    if (admin.phone !== '9014380344') {
      admin.phone = '9014380344';
      updated = true;
    }
    if (!admin.password) {
      admin.password = hashedPassword;
      updated = true;
    }
    if (updated) {
      await admin.save();
      console.log('✅ [ADMIN SEED] Super admin profile updated:', normalizedEmail);
    }
  }

  return admin;
}

export async function verifyAdminCredentials(email, password) {
  await ensureSuperAdmin();
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (normalizedEmail !== SUPER_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      message: 'Access Denied: Only super admin (vonexperts@gmail.com) can access the Admin portal.'
    };
  }

  const admin = await Admin.findOne({ email: normalizedEmail });
  if (!admin) {
    return { success: false, message: 'Invalid Admin email address' };
  }

  if (admin.password) {
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch && password !== SUPER_ADMIN_PASSWORD_PLAIN) {
      return { success: false, message: 'Incorrect Password for Super Admin' };
    }
  } else if (password !== SUPER_ADMIN_PASSWORD_PLAIN) {
    return { success: false, message: 'Incorrect Password for Super Admin' };
  }

  return { success: true, admin };
}
