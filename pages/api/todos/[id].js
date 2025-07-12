import connectToDatabase from '../../../lib/mongodb';
import FallbackStorage from '../../../lib/fallback-storage';
import { ObjectId } from 'mongodb';

// Initialize fallback storage
let fallbackStorage = null;
if (typeof window === 'undefined') {
  fallbackStorage = new FallbackStorage();
}

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    // Try to connect to MongoDB
    const { db } = await connectToDatabase();
    console.log('✅ Using MongoDB for storage');

    switch (method) {
      case 'GET':
        try {
          const todo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
          
          if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
          }

          res.status(200).json(todo);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch todo', details: error.message });
        }
        break;

      case 'PUT':
        try {
          const { title, desc } = req.body;
          
          // Check if todo with same title already exists (excluding current todo)
          const existingTodo = await db.collection('todos').findOne({ 
            title, 
            _id: { $ne: new ObjectId(id) } 
          });
          
          if (existingTodo) {
            return res.status(400).json({ error: 'Todo with this title already exists' });
          }

          const updatedTodo = {
            title,
            desc,
            updatedAt: new Date()
          };

          const result = await db.collection('todos').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedTodo }
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
          }

          res.status(200).json({ message: 'Todo updated successfully' });
        } catch (error) {
          res.status(500).json({ error: 'Failed to update todo', details: error.message });
        }
        break;

      case 'DELETE':
        try {
          const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
          
          if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
          }

          res.status(200).json({ message: 'Todo deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: 'Failed to delete todo', details: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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
          const todo = await fallbackStorage.getTodoById(id);
          
          if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
          }

          res.status(200).json(todo);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch todo', details: error.message });
        }
        break;

      case 'PUT':
        try {
          const { title, desc } = req.body;
          
          // Check if todo with same title already exists (excluding current todo)
          const existingTodo = await fallbackStorage.findTodoByTitle(title);
          if (existingTodo && existingTodo._id !== id) {
            return res.status(400).json({ error: 'Todo with this title already exists' });
          }

          const updatedTodo = await fallbackStorage.updateTodo(id, { title, desc });
          if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
          }

          res.status(200).json({ message: 'Todo updated successfully (using fallback storage)', storage: 'fallback' });
        } catch (error) {
          res.status(500).json({ error: 'Failed to update todo', details: error.message });
        }
        break;

      case 'DELETE':
        try {
          const deleted = await fallbackStorage.deleteTodo(id);
          
          if (!deleted) {
            return res.status(404).json({ error: 'Todo not found' });
          }

          res.status(200).json({ message: 'Todo deleted successfully (using fallback storage)', storage: 'fallback' });
        } catch (error) {
          res.status(500).json({ error: 'Failed to delete todo', details: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
} 