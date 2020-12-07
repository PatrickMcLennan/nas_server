import fs from 'fs';
import path from 'path';

import { config } from 'dotenv';

config();

export const resolvers = {
  Query: {
    hello: () => `hellofdfd`,
    movies: () => {
      const jsonFiles = fs.readdirSync(process.env.MOVIES_JSON ?? `NULL`);
      return jsonFiles;
    },
  },
};
