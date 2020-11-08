import express from 'express';
import { networkInterfaces } from 'os';
import { typeDefs } from './graphql/typedefs';
import { resolvers } from './graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';

const ip =
  networkInterfaces()?.en0?.find(
    ({ family }) => family.toLowerCase() === `ipv4`
  ).address ?? `Problem detecting IP`;
const port = 4000;

console.log(ip);

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: `/api` });
// Start the server
app.listen(port, () => console.log(`Running on ${ip}:${port}`));
