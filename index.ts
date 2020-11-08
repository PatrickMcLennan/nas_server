import express from 'express';
import { typeDefs } from './graphql/typedefs';
import { resolvers } from './graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: `/api` });
// Start the server
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});
