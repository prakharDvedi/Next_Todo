import { MongoClient } from 'mongodb';

// Encode the password to handle special characters like @
const password = encodeURIComponent('Plasma@2005');

// Try different connection string formats
const MONGODB_URI_OPTIONS = [
  `mongodb+srv://prakhar:${password}@todo.stu2wgg.mongodb.net/?retryWrites=true&w=majority`,
  `mongodb+srv://prakhar:${password}@todo.stu2wgg.mongodb.net/todo-app?retryWrites=true&w=majority`,
  `mongodb+srv://prakhar:${password}@todo.stu2wgg.mongodb.net/todo-app`
];

const MONGODB_DB = 'todo-app';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    // Try different connection strings
    let lastError;
    
    for (const uri of MONGODB_URI_OPTIONS) {
      try {
        console.log(`🔄 Trying connection: ${uri.replace(password, '***')}`);
        
        cached.promise = MongoClient.connect(uri, opts)
          .then((client) => {
            console.log('✅ MongoDB connected successfully');
            return {
              client,
              db: client.db(MONGODB_DB),
            };
          });
        
        cached.conn = await cached.promise;
        return cached.conn;
      } catch (error) {
        console.error(`❌ Connection failed with URI: ${uri.replace(password, '***')}`, error.message);
        lastError = error;
        continue;
      }
    }
    
    // If all connections failed
    console.error('❌ All MongoDB connection attempts failed');
    throw lastError || new Error('Failed to connect to MongoDB');
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase; 