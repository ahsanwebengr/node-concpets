const Tenant = require('../models/Tenant');

const resolveTenant = async (req, res, next) => {
  try {
    const tenantSlug = req.header('X-Tenant-ID');
    if (!tenantSlug) return res.status(400).json({ error: 'Tenant ID required' });

    const tenant = await Tenant.findOne({ slug: tenantSlug, isActive: true });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    req.tenant = tenant;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = resolveTenant;
