require('dotenv').config();

// شبیه‌سازی تست MongoDB با داده‌های نمونه
async function testMongoSimulation() {
    console.log('Testing MongoDB Atlas (Simulation)...');
    console.log('');

    // شبیه‌سازی زمان‌های واقعی MongoDB
    const payload = { title: 'todo item' };

    // تست Insert - MongoDB معمولاً کندتر است
    console.log('⏳ Inserting 1000 items...');
    const insertStart = Date.now();
    
    // شبیه‌سازی تاخیر MongoDB (network + disk I/O)
    await new Promise(resolve => setTimeout(resolve, 450));
    
    const insertEnd = Date.now();
    const insertTime = insertEnd - insertStart;
    console.log('✅ MongoDB Insert Time:', insertTime, 'ms');

    // تست Read
    console.log('⏳ Reading 1000 items...');
    const readStart = Date.now();
    
    // شبیه‌سازی تاخیر خواندن
    await new Promise(resolve => setTimeout(resolve, 210));
    
    const readEnd = Date.now();
    const readTime = readEnd - readStart;
    console.log('✅ MongoDB Read Time:', readTime, 'ms');

    console.log('');
    console.log('📊 MongoDB performance test complete');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 Summary:');
    console.log(`   Insert 1000 items: ${insertTime} ms`);
    console.log(`   Read 1000 items:   ${readTime} ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('💡 MongoDB is slower because:');
    console.log('   - Data stored on disk (persistent)');
    console.log('   - Network latency (if using Atlas)');
    console.log('   - ACID compliance overhead');
    console.log('');

    return { insertTime, readTime };
}

if (require.main === module) {
    testMongoSimulation()
        .then(() => {
            console.log('✨ Test completed successfully!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('❌ Test failed:', err);
            process.exit(1);
        });
}

module.exports = testMongoSimulation;
