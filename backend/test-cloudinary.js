require('dotenv').config();
const { cloudinary } = require('./config/cloudinary');

async function testCloudinary() {
  console.log('=== Cloudinary Setup Test ===');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY);
  console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);
  
  try {
    // Test cloudinary connection by getting account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
  } catch (error) {
    console.error('❌ Cloudinary connection failed:');
    console.error('Error:', error.message);
    if (error.http_code) {
      console.error('HTTP Code:', error.http_code);
    }
  }
  
  process.exit(0);
}

testCloudinary().catch(console.error);
