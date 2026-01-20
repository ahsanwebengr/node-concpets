# Database Normalization in MongoDB

This project demonstrates data normalization concepts using MongoDB (NoSQL) in a Node.js application. While MongoDB emphasizes denormalization for performance, this example shows how to structure data with references and embedding to balance normalization and efficiency.

## Overview

Data normalization reduces redundancy and improves data integrity. In relational databases, this involves splitting data into tables (1NF, 2NF, 3NF). In MongoDB, we use:

- **Referencing**: Linking documents via ObjectIds (like foreign keys).
- **Embedding**: Nesting related data in a single document for faster reads.

## Example: E-commerce Order System

### Unnormalized Data (Conceptual)

A single document with all order details, leading to redundancy.

### Normalized Structure

- **Customers**: Referenced for user info.
- **Products**: Referenced for item details.
- **Orders**: Embed order items for quick access, reference customer and products.

### Schemas

#### Customer

```javascript
{
  name: String,
  address: String
}
```

#### Product

```javascript
{
  name: String,
  price: Number
}
```

#### Order

```javascript
{
  customer: ObjectId (ref: Customer),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number
    }
  ],
  total: Number,
  createdAt: Date
}
```

## Setup

1. Install dependencies: `npm install`
2. Start MongoDB locally.
3. Run: `node src/index.js` (seeds sample data).

## Benefits

- Reduces redundancy (customer/product data not duplicated).
- Maintains integrity with references.
- Embedding in orders speeds up queries.

For relational normalization, see SQL examples. This MongoDB version prioritizes read performance over strict normalization.
