const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  deadline: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
