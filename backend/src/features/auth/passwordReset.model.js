import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    otpHash: { type: String, required: true },
    resetTokenHash: { type: String, default: null },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
    verifiedAt: { type: Date, default: null },
    usedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('PasswordReset', passwordResetSchema);
