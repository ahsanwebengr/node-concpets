module.exports = `
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    addUser(name: String!, email: String!, age: Int): User
    updateUser(id: ID!, name: String, email: String, age: Int): User
    deleteUser(id: ID!): User
  }
`;
