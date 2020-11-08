import fs from 'fs';
import path from 'path';

import { config } from 'dotenv';

config();

// Some fake data
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

export const resolvers = {
  Query: {
    books: () => books,
    hello: () => `hellofdfd`,
    movies: () => {
      const currentDir = path.resolve(process.env.MOVIES_DIR ?? `NULL`);
      const files = fs.readdirSync(currentDir);
      return files;
    },
  },
};
