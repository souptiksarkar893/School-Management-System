const mysql = require('mysql2/promise');

// Ensure environment variables are loaded
require('dotenv').config();

console.log('=== Database Config Debug ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

// Parse DATABASE_URL if provided (Railway format)
let dbConfig;

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL format: mysql://user:password@host:port/database
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false
      }
    };
    console.log('✅ Using DATABASE_URL for database connection');
    console.log('Database host:', url.hostname);
    console.log('Database port:', url.port);
    console.log('Database name:', url.pathname.slice(1));
    console.log('Database user:', url.username);
  } catch (error) {
    console.error('❌ Error parsing DATABASE_URL:', error);
    throw new Error('Invalid DATABASE_URL format');
  }
} else {
  // Use individual environment variables
  dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: false
    }
  };
  console.log('⚠️ Using individual DB environment variables');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
}

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create schools table if it doesn't exist
    const createSchoolsTable = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact VARCHAR(20) NOT NULL,
        image TEXT NOT NULL,
        email_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createSchoolsTable);
    console.log('Schools table created/verified successfully!');
    
    connection.release();
  } catch (error) {
    console.error('Database initialization failed:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};
