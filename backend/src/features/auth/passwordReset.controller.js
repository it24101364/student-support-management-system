import { requestPasswordReset, resetPassword, verifyPasswordOtp } from './passwordReset.service.js';

export async function forgotPassword(request, response, next) {
  try {
    await requestPasswordReset(request.body);
    response.json({ success: true, data: { message: 'If an active account exists, a verification code has been sent.' } });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(request, response, next) {
  try {
    const resetToken = await verifyPasswordOtp(request.body);
    response.json({ success: true, data: { resetToken } });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(request, response, next) {
  try {
    await resetPassword(request.body);
    response.json({ success: true, data: { message: 'Password updated. You can now log in.' } });
  } catch (error) {
    next(error);
  }
}
