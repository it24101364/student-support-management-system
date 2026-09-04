import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import User from '../models/User.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || 'System Administrator';

if (!email || !password) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
}

await connectDatabase();
const passwordHash = await bcrypt.hash(password, 12);
await User.findOneAndUpdate(
  { email },
  { name, email, passwordHash, role: 'ADMIN', status: 'ACTIVE' },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log(`Admin account ready: ${email}`);
process.exit(0);
