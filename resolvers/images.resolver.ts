import { Query, Resolver } from 'type-graphql';
import { Image } from '../entities/image.entity';
import fs from 'fs';
import { config } from 'dotenv';

config();
@Resolver(Image)
export class ImageResolver {
  @Query(() => [Image])
  async images(): Promise<Image['name'][]> {
    return new Promise((res, rej) =>
      fs.readdir(process.env.BACKGROUNDS_DIR ?? `NULL`, (err, files) =>
        err ? rej(err) : res(files)
      )
    );
  }
}
