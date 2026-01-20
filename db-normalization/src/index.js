const mongoose = require('./config/db');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function seedData() {
  try {
    // Sample data
    const customer = await Customer.create({ name: 'Alice', address: '123 Main St' });
    const product1 = await Product.create({ name: 'Laptop', price: 1000 });
    const product2 = await Product.create({ name: 'Mouse', price: 50 });

    const order = await Order.create({
      customer: customer._id,
      items: [
        { product: product1._id, quantity: 1 },
        { product: product2._id, quantity: 2 },
      ],
      total: 1100,
    });

    console.log('Sample data seeded');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();
