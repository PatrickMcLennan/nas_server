import fs from 'fs';
import path from 'path';

import { config } from 'dotenv';

config();

function getJSONData(filePath: string): Promise<Record<string, unknown>> {
  return new Promise((res) => {
    fs.readFile(filePath, `utf8`, (err, file) => {
      if (err) console.error(err);
      res(JSON.parse(file));
    });
  });
}

export const resolvers = {
  Query: {
    hello: () => `hellofdfd`,
    movies: () => {
      const jsonFiles = fs.readdirSync(process.env.MOVIES_JSON ?? `NULL`);
      return Promise.all(
        jsonFiles.map((file) =>
          getJSONData(path.resolve(process.env.MOVIES_JSON ?? `NULL`, file))
        )
      ).catch(console.error);
    },
  },
};
