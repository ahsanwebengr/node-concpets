const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const resolveTenant = require('../middleware/tenant');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', resolveTenant, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ tenant: req.tenant._id, email });
    if (existing) return res.status(400).json({ error: 'Email exists' });

    const isFirst = (await User.countDocuments({ tenant: req.tenant._id })) === 0;
    const user = await User.create({
      tenant: req.tenant._id,
      name,
      email,
      password,
      role: isFirst ? 'admin' : 'member',
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(201).json({ user: { id: user._id, name, email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', resolveTenant, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ tenant: req.tenant._id, email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ user: { id: user._id, name: user.name, email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', auth, (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ id: _id, name, email, role, tenant: req.user.tenant.slug });
});

module.exports = router;
