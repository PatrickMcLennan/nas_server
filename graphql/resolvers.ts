import fs from 'fs';
import path from 'path';

import { config } from 'dotenv';

config();

export const resolvers = {
  Query: {
    hello: () => `hellofdfd`,
    movies: () => {
      const currentDir = path.resolve(process.env.MOVIES_JSON ?? `NULL`);
      const files = fs.readdirSync(currentDir);
      return files;
    },
  },
};
