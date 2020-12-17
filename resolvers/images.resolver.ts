import { Query, Resolver } from 'type-graphql';
import { Image } from '../entities/image.entity';
import fs from 'fs';
import { config } from 'dotenv';

config({ path: `../../.env` });
@Resolver(Image)
export class ImageResolver {
  @Query(() => [Image])
  images(): Promise<Image[]> {
    return new Promise((res, rej) =>
      fs.readdir(process.env.BACKGROUNDS_DIR ?? `NULL`, (err, files) =>
        err ? rej(err) : res(files.map((file) => ({ name: file })))
      )
    );
  }
}
