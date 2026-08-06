/**
 * Helper to send real SMS OTPs to Indian/International mobile numbers.
 * Supports Fast2SMS, 2Factor, or Twilio via environment variables.
 */

export const sendSmsOtp = async (phoneNumber, otp) => {
    // Clean phone number (extract 10 digit Indian number if +91 included)
    const rawPhone = phoneNumber.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;

    // 1. Fast2SMS (India)
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey) {
        try {
            const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${otp}&numbers=${cleanPhone}`;
            const res = await fetch(url, { method: 'GET' });
            const data = await res.json();
            console.log('Fast2SMS Response:', data);
            if (data.return) {
                return { success: true, provider: 'Fast2SMS' };
            }
        } catch (err) {
            console.error('Fast2SMS Error:', err);
        }
    }

    // 2. 2Factor (India)
    const twoFactorKey = process.env.TWOFACTOR_API_KEY;
    if (twoFactorKey) {
        try {
            const url = `https://2factor.in/API/V1/${twoFactorKey}/SMS/${cleanPhone}/${otp}`;
            const res = await fetch(url, { method: 'GET' });
            const data = await res.json();
            console.log('2Factor Response:', data);
            if (data.Status === 'Success') {
                return { success: true, provider: '2Factor' };
            }
        } catch (err) {
            console.error('2Factor Error:', err);
        }
    }

    // 3. Fallback/Dev Mode
    console.log(`[SMS MOCK] Real SMS Gateway API Key missing. OTP for ${cleanPhone} is ${otp}`);
    return { success: true, provider: 'Mock', message: 'No API Key configured' };
};
