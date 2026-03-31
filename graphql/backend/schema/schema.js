const { buildSchema } = require('graphql');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const schema = buildSchema(typeDefs);

module.exports = { schema, rootValue: resolvers };
