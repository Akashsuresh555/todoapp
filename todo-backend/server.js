require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/TodoList');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

// API Endpoints
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new TodoModel(req.body);
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await TodoModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

const path = require('path');

// Serve static files from React
app.use(express.static(path.join(__dirname, '../todo-frontend/build')));

// Catch-all route for serving React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../todo-frontend/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
