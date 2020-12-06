import { MikroORM } from '@mikro-orm/core';
import { Movie } from './entities/movie.entity';

/**
 * MikroORM settings.
 *
 * @see https://mikro-orm.io/docs/installation
 */

export default MikroORM.init({
  entities: [Movie],
  dbName: `nas_media`,
  type: `postgresql`,
  clientUrl: ``,
});
