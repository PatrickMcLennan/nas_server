import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Movie {
    id: Id!
    title: String!
    backdrop: String
    overview: String
    path: String!
  }

  type Query {
    books: [Book]
    movies: [String]
    hello: String
  }
`;
