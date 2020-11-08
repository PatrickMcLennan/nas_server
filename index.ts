import express from 'express';
import { typeDefs } from './graphql/typedefs';
import { resolvers } from './graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';

const port = 4000;

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: `/api` });
// Start the server
app.listen(port, () => console.log(`Running on Port ${port}`));
