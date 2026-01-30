const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const tenantSchema = new mongoose.Schema({
  name: String,
  slug: String,
  plan: { type: String, default: 'free' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Tenant = mongoose.model('Tenant', tenantSchema);

async function createTenant(name, slug) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const existing = await Tenant.findOne({ slug });
    if (existing) {
      console.log(`Tenant "${slug}" already exists!`);
      process.exit(0);
    }
    
    const tenant = await Tenant.create({ name, slug });
    console.log(`✓ Tenant created successfully!`);
    console.log(`  Name: ${tenant.name}`);
    console.log(`  Slug: ${tenant.slug}`);
    console.log(`\nAccess your tenant at: http://${slug}.localhost:3000`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node create-tenant.js <name> <slug>');
  console.log('Example: node create-tenant.js "Acme Corp" acme');
  process.exit(1);
}

createTenant(args[0], args[1]);
