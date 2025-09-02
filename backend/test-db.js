require('dotenv').config();
const { pool, testConnection, initializeDatabase } = require('./config/database');

async function testDatabaseSetup() {
  console.log('=== Database Setup Test ===');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    console.log('Host:', url.hostname);
    console.log('Port:', url.port);
    console.log('Database:', url.pathname.slice(1));
    console.log('User:', url.username);
    console.log('Password length:', url.password ? url.password.length : 0);
  }
  
  console.log('\n=== Testing Connection ===');
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('✅ Database connection successful!');
    console.log('\n=== Creating Tables ===');
    await initializeDatabase();
    console.log('✅ Tables created/verified successfully!');
    
    // Test basic query
    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM schools');
      console.log('✅ Schools table exists. Current count:', rows[0].count);
    } catch (error) {
      console.error('❌ Error querying schools table:', error.message);
    }
  } else {
    console.log('❌ Database connection failed!');
  }
  
  process.exit(0);
}

testDatabaseSetup().catch(console.error);
