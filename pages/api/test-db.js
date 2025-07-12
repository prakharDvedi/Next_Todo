import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    const { db } = await connectToDatabase();
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    
    console.log('✅ Database connection test successful');
    res.status(200).json({ 
      message: 'Database connection successful!',
      database: db.databaseName,
      collections: collections.map(col => col.name),
      status: 'connected'
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    // Provide specific error messages based on error type
    let errorMessage = 'Database connection failed';
    let suggestion = 'Please check your MongoDB connection string and network connectivity';
    
    if (error.message.includes('authentication')) {
      errorMessage = 'Authentication failed';
      suggestion = 'Please check your username and password';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      errorMessage = 'Network error - cannot reach MongoDB server';
      suggestion = 'Please check your internet connection and MongoDB Atlas cluster status';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Connection timeout';
      suggestion = 'Please check your network connection and try again';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message,
      suggestion: suggestion,
      timestamp: new Date().toISOString()
    });
  }
} 