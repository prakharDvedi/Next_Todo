const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
const password = encodeURIComponent('Plasma@2005');
const MONGODB_URI = `mongodb+srv://prakhar:${password}@todo.stu2wgg.mongodb.net/?retryWrites=true&w=majority`;
const MONGODB_DB = 'todo-app';
let db;

app.use(cors());
app.use(express.json());

async function connectToDatabase() {
  if (db) return db;
  const client = await MongoClient.connect(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
  db = client.db(MONGODB_DB);
  return db;
}

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const todos = await db.collection('todos').find({}).toArray();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos', details: err.message });
  }
});

// POST create todo
app.post('/api/todos', async (req, res) => {
  const { title, desc } = req.body;
  if (!title || !desc) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  try {
    const db = await connectToDatabase();
    const existing = await db.collection('todos').findOne({ title });
    if (existing) {
      return res.status(400).json({ error: 'Todo with this title already exists' });
    }
    const newTodo = { title, desc, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection('todos').insertOne(newTodo);
    res.status(201).json({ message: 'Todo created successfully', todo: { ...newTodo, _id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo', details: err.message });
  }
});

// GET single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const todo = await db.collection('todos').findOne({ _id: new ObjectId(req.params.id) });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todo', details: err.message });
  }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
  const { title, desc } = req.body;
  try {
    const db = await connectToDatabase();
    const existing = await db.collection('todos').findOne({ title, _id: { $ne: new ObjectId(req.params.id) } });
    if (existing) {
      return res.status(400).json({ error: 'Todo with this title already exists' });
    }
    const result = await db.collection('todos').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, desc, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo', details: err.message });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('todos').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Todo API is running!');
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
}); 