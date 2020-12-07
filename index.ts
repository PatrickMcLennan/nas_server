import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MovieResolver } from './resolvers/movie.resolver';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, `../.env`) });

const PORT = process.env.PORT;

buildSchema({ resolvers: [MovieResolver] })
  .then((schema) => {
    const app = express();
    const server = new ApolloServer({ schema, playground: true });
    server.applyMiddleware({ app, path: `/graphql` });
    return app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
  })
  .catch((error) =>
    console.error(`There was error building the schema: ${error}`)
  );
