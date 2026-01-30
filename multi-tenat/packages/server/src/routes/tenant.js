const express = require('express');
const Tenant = require('../models/Tenant');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, slug } = req.body;

    const existing = await Tenant.findOne({ slug });
    if (existing) return res.status(400).json({ error: 'Tenant slug exists' });

    const tenant = await Tenant.create({ name, slug });
    res.status(201).json(tenant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ error: 'Not found' });
    res.json(tenant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
