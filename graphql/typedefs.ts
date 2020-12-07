import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Movie {
    id: ID!
    title: String!
    backdrop: String
    overview: String
    path: String!
    poster: String
    genres: [String]
    release: String
    trailers: [Book]
  }

  type Query {
    books: [Book]
    movies: [Movie]
    hello: String
  }
`;
