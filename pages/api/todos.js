import connectToDatabase from '../../lib/mongodb';
import FallbackStorage from '../../lib/fallback-storage';

// Initialize fallback storage
let fallbackStorage = null;
if (typeof window === 'undefined') {
  fallbackStorage = new FallbackStorage();
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    // Try to connect to MongoDB
    const { db } = await connectToDatabase();
    console.log('✅ Using MongoDB for storage');

    switch (method) {
      case 'GET':
        try {
          const todos = await db.collection('todos').find({}).toArray();
          res.status(200).json(todos);
        } catch (error) {
          console.error('Failed to fetch todos from MongoDB:', error);
          res.status(500).json({ error: 'Failed to fetch todos', details: error.message });
        }
        break;

      case 'POST':
        try {
          const { title, desc } = req.body;
          
          if (!title || !desc) {
            return res.status(400).json({ error: 'Title and description are required' });
          }
          
          // Check if todo with same title already exists
          const existingTodo = await db.collection('todos').findOne({ title });
          if (existingTodo) {
            return res.status(400).json({ error: 'Todo with this title already exists' });
          }

          const newTodo = {
            title,
            desc,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const result = await db.collection('todos').insertOne(newTodo);
          res.status(201).json({ message: 'Todo created successfully', todo: { ...newTodo, _id: result.insertedId } });
        } catch (error) {
          console.error('Failed to create todo in MongoDB:', error);
          res.status(500).json({ error: 'Failed to create todo', details: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('MongoDB connection failed, using fallback storage:', error.message);
    
    // Use fallback storage
    if (!fallbackStorage) {
      return res.status(500).json({ 
        error: 'No storage available', 
        details: 'Both MongoDB and fallback storage are unavailable'
      });
    }

    console.log('🔄 Using fallback storage');

    switch (method) {
      case 'GET':
        try {
          const todos = await fallbackStorage.getAllTodos();
          res.status(200).json(todos);
        } catch (error) {
          console.error('Failed to fetch todos from fallback storage:', error);
          res.status(500).json({ error: 'Failed to fetch todos', details: error.message });
        }
        break;

      case 'POST':
        try {
          const { title, desc } = req.body;
          
          if (!title || !desc) {
            return res.status(400).json({ error: 'Title and description are required' });
          }
          
          // Check if todo with same title already exists
          const existingTodo = await fallbackStorage.findTodoByTitle(title);
          if (existingTodo) {
            return res.status(400).json({ error: 'Todo with this title already exists' });
          }

          const newTodo = await fallbackStorage.createTodo({ title, desc });
          res.status(201).json({ 
            message: 'Todo created successfully (using fallback storage)', 
            todo: newTodo,
            storage: 'fallback'
          });
        } catch (error) {
          console.error('Failed to create todo in fallback storage:', error);
          res.status(500).json({ error: 'Failed to create todo', details: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
} 