import { ImageDTO } from '../types/images.types';
import path from 'path';
import https from 'https';
import fs from 'fs';

import { config } from 'dotenv';

config({ path: `../../.env` });

export function downloadBackground(
  result: ImageDTO
): Promise<{ name: string; success: boolean }> {
  const { url, name, ext } = result;
  return new Promise((res, rej) => {
    const dest = path.join(
      process.env.BACKGROUNDS_DIR ?? `NULL`,
      `${name}.${ext}`
    );
    const file = fs.createWriteStream(dest);
    return https
      .get(url, (response) => {
        response.pipe(file);
        file.on(`finish`, () => {
          file.close();
          res({ name, success: true });
        });
      })
      .on(`error`, (_err) =>
        fs.unlink(dest, () => res({ name, success: false }))
      );
  });
}
