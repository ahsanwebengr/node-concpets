const express = require('express');
const cors = require('cors');
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');
const { schema, rootValue } = require('./schema/schema');

require('./db');

const app = express();

app.use(cors({ origin: '*' }));

// GraphiQL UI
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

// GraphQL API
app.use('/graphql', createHandler({ schema, rootValue }));

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
