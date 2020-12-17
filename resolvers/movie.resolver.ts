import { Query, Resolver } from 'type-graphql';
import { Movie } from '../entities/movie.entity';
import fs from 'fs';
import { config } from 'dotenv';

config({ path: `../../.env` });
@Resolver(Movie)
export class MovieResolver {
  @Query(() => [Movie])
  async movies(): Promise<Movie['title'][]> {
    return new Promise((res, rej) =>
      fs.readdir(process.env.MOVIES_DIR ?? `NULL`, (err, files) =>
        err ? rej(err) : res(files)
      )
    );
  }
}
