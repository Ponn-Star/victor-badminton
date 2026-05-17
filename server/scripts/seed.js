/**
 * Seed script: migrate toàn bộ data từ file JS tĩnh vào MongoDB
 * Chạy: node server/scripts/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import Product from '../models/Product.js';
import Athlete from '../models/Athlete.js';

// Import data files
import racketsData from '../data/racket.js';
import shoesData from '../data/shoes.js';
import shuttleData from '../data/shuttle.js';
import athletesData from '../data/athletes.js';

async function seed() {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to:', process.env.MONGODB_URI);

    // ── Seed Products ──────────────────────────────────────────────────────────

    // Chuẩn hóa rackets
    const rackets = racketsData.map(item => ({
        ...item,
        price: typeof item.price === 'string' ? parseInt(item.price.replace(/\D/g, '')) : item.price,
        status: 'racket',
        isActive: true,
    }));

    // Chuẩn hóa shoes
    const shoes = shoesData.map(item => ({
        ...item,
        status: 'shoes',
        isActive: true,
    }));

    // Chuẩn hóa shuttles
    const shuttles = shuttleData.map(item => ({
        ...item,
        status: 'shuttle',
        isActive: true,
    }));

    const allProducts = [...rackets, ...shoes, ...shuttles];

    console.log(`\n📦 Seeding ${allProducts.length} products...`);
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(allProducts, { ordered: false });
    console.log(`✅ Inserted ${insertedProducts.length} products`);
    console.log(`   - Rackets: ${rackets.length}`);
    console.log(`   - Shoes:   ${shoes.length}`);
    console.log(`   - Shuttles: ${shuttles.length}`);

    // ── Seed Athletes ──────────────────────────────────────────────────────────
    const athletes = athletesData.map(item => ({
        ...item,
        isActive: true,
    }));

    console.log(`\n🏆 Seeding ${athletes.length} athletes...`);
    await Athlete.deleteMany({});
    const insertedAthletes = await Athlete.insertMany(athletes, { ordered: false });
    console.log(`✅ Inserted ${insertedAthletes.length} athletes`);

    console.log('\n🎉 Seed completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
});
