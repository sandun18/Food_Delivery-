import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/password.js';

dotenv.config();

/**
 * Seed Default Administrator Account into MongoDB
 * Usage: node scripts/seedAdmin.js
 */
const seedAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@foodies.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminName = 'System Administrator';

    console.log(`Checking if admin user exists with email: ${adminEmail}`);
    let admin = await User.findOne({ email: adminEmail.toLowerCase().trim() });

    if (admin) {
      console.log(`Admin user found. Ensuring role is set to 'admin'...`);
      admin.role = 'admin';
      await admin.save();
      console.log(`✅ Admin account updated successfully!`);
    } else {
      console.log(`Creating new Admin account...`);
      const hashedPassword = await hashPassword(adminPassword);

      admin = new User({
        name: adminName,
        email: adminEmail.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin',
        cartData: {}
      });

      await admin.save();
      console.log(`✅ Default admin account created successfully!`);
    }

    console.log('====================================');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role:     ${admin.role}`);
    console.log('====================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
