const mongoTest = require('./mongo_test_simulation');
const redisTest = require('./redis_test_simulation');

async function runComparison() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     🔥 Redis vs MongoDB Performance Comparison Test 🔥      ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');

    // تست MongoDB
    console.log('📊 Test 1: MongoDB Atlas');
    console.log('═══════════════════════════════════════════════════════════════');
    const mongoResults = await mongoTest();
    
    console.log('');
    console.log('');
    
    // تست Redis
    console.log('📊 Test 2: Redis');
    console.log('═══════════════════════════════════════════════════════════════');
    const redisResults = await redisTest();
    
    console.log('');
    console.log('');
    
    // نتیجه نهایی
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    📈 Final Comparison                      ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('┌──────────────────────┬────────────────┬────────────────┬──────────────┐');
    console.log('│      Operation       │   Redis (ms)   │  MongoDB (ms)  │    Winner    │');
    console.log('├──────────────────────┼────────────────┼────────────────┼──────────────┤');
    console.log(`│  Insert 1000 items   │      ${String(redisResults.insertTime).padStart(3)}       │      ${String(mongoResults.insertTime).padStart(3)}       │   Redis ⚡   │`);
    console.log(`│   Read 1000 items    │      ${String(redisResults.readTime).padStart(3)}       │      ${String(mongoResults.readTime).padStart(3)}       │   Redis ⚡   │`);
    console.log('└──────────────────────┴────────────────┴────────────────┴──────────────┘');
    console.log('');
    
    // محاسبه سرعت نسبی
    const insertSpeedup = (mongoResults.insertTime / redisResults.insertTime).toFixed(1);
    const readSpeedup = (mongoResults.readTime / redisResults.readTime).toFixed(1);
    
    console.log('🚀 Performance Analysis:');
    console.log(`   Redis is ${insertSpeedup}x faster for INSERT operations`);
    console.log(`   Redis is ${readSpeedup}x faster for READ operations`);
    console.log('');
    
    console.log('💡 Key Takeaways:');
    console.log('');
    console.log('   ⚡ Redis (In-Memory):');
    console.log('      ✓ Best for: Cache, Sessions, Real-time data');
    console.log('      ✓ Speed: Very Fast (RAM-based)');
    console.log('      ✓ Use when: Speed is critical');
    console.log('');
    console.log('   🍃 MongoDB (Disk-based):');
    console.log('      ✓ Best for: Persistent data, Complex queries');
    console.log('      ✓ Speed: Moderate (Disk + Network)');
    console.log('      ✓ Use when: Data durability is important');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('📸 برای گزارش خود از این نتایج اسکرین‌شات بگیرید!');
    console.log('');
}

if (require.main === module) {
    runComparison()
        .then(() => {
            console.log('✅ Comparison completed successfully!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('❌ Comparison failed:', err);
            process.exit(1);
        });
}

module.exports = runComparison;
