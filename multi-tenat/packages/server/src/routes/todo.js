const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { completed, priority } = req.query;
    const filter = { tenant: req.tenantId, user: req.user._id };

    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const todo = await Todo.create({
      tenant: req.tenantId,
      user: req.user._id,
      title,
      description,
      priority,
      dueDate,
    });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      tenant: req.tenantId,
      user: req.user._id,
    });
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenantId, user: req.user._id },
      { title, description, completed, priority, dueDate },
      { new: true },
    );
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenantId,
      user: req.user._id,
    });
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
