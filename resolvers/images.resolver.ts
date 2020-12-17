import { Query, Resolver } from 'type-graphql';
import { Image } from '../entities/image.entity';
import fs from 'fs';
import { config } from 'dotenv';

config();
@Resolver(Image)
export class ImageResolver {
  @Query(() => [Image])
  async images(): Promise<Image['name'][]> {
    const images = fs.readdirSync(process.env.BACKGROUNDS_DIR ?? `NULL`);
    return images ?? `NULL`;
  }
}
