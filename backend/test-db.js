import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

console.log('Testing connection to MongoDB...');
console.log(`URI: ${process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED'}`);

await connectDB();
console.log('Database test completed successfully!');
process.exit(0);
