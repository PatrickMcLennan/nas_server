import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Image } from '../entities/image.entity';
import fs from 'fs';
import { config } from 'dotenv';
import { ImageDTO, ImageExtension } from '../types/images.types';
import { downloadBackground } from '../lib/downloadBackground';
import { WebClient } from '@slack/web-api';
import { slackPost } from '../lib/slackPost';
import { timeStamp } from '../lib/logger';

config({ path: `../../.env` });
@Resolver(Image)
export class ImageResolver {
  /**
   * Get all backgrounds
   */
  @Query(() => [Image])
  images(): Promise<Image[]> {
    return new Promise((res, rej) =>
      fs.readdir(process.env.BACKGROUNDS_DIR ?? `NULL`, (err, files) =>
        err ? rej(err) : res(files.map((file) => ({ name: file })))
      )
    );
  }

  /**
   * TODO: Return to this, almost done
   * @param newImages
   */

  @Mutation()
  newImages(@Arg(`newImages`) newImages: ImageDTO[]): Promise<string> {
    return new Promise((res, rej) =>
      fs.readdir(process.env.BACKGROUNDS_DIR ?? `NULL`, (err, files) => {
        if (err) rej(err);
        const map = new Map(files.map((file) => [file, null]));
        const Slackbot = new WebClient(process.env.LOGGER_SLACK_BOT);
        const newDownloads = newImages.filter(
          ({ name, ext }) =>
            !map.has(`${name}.${ext}`) &&
            Object.keys(ImageExtension).includes(ext)
        );
        return Promise.all(newDownloads.map(downloadBackground))
          .then((results) =>
            slackPost(
              Slackbot,
              results
                .map(
                  (result) =>
                    `\n${timeStamp()} -- ${result.name} was ${
                      !result.success && `not`
                    } downloaded\n`
                )
                .join(`,`)
            )
          )
          .then(() => res(`Success!  Check the Slack Channel`))
          .catch((err) =>
            rej(
              slackPost(
                Slackbot,
                `\n${timeStamp()} -- There was an error in the ImagesResolver:\n ${err}`
              )
            )
          );
      })
    );
  }
}
