import { argv } from 'process';
import { config } from 'dotenv';
import { WebClient } from '@slack/web-api';
import { directoryMap, errorService, filesMap, isDir } from './shared';
import { Error } from '../types/errors.types';
import { timeStamp } from './logger';
import { SlackChannels } from '../types/slack.types';
import path from 'path';

/**
 * When given a show ID and Season ID, find that season
 * . get the ID for each episode and append that ID to the
 * episodes name.
 */

config({ path: path.resolve(__dirname, `../../.env`) });

const [showId, seasonId] = [Number(argv[2]), Number(argv[3])];
const Slackbot = new WebClient(process.env.BACKGROUNDS_SLACK_BOT);
const slackConfig = { bot: Slackbot, channel: SlackChannels.Tv };

if (!showId || !seasonId)
  errorService(
    Error.High,
    `\n${timeStamp()} -- getEpisodeId Error:\n getEpisodeId was trying to be run without a Show ID and/or Season ID.  The files in these directories have to be formatted properly with their ID's in the name.\n`,
    slackConfig
  );

async function main() {
  const showsMap = await directoryMap(process.env.TV_DIR ?? `NULL`);

  if (!showsMap.has(showId))
    return errorService(
      Error.High,
      `\n${timeStamp()} -- getEpisodeId Error"\n The show ID ${showId} was not found within ${
        process.env.TV_DIR
      }`,
      slackConfig
    );

  const showPath = showsMap.get(showId);
  const showIsDir = await isDir(showPath ?? ``);

  if (!showPath || !showIsDir)
    return errorService(
      Error.High,
      `\n${timeStamp()} -- getEpisodeId Error:\n ${showPath} is not a directory within ${
        process.env.TV_DIR
      }`,
      slackConfig
    );

  const seasonsMap = await directoryMap(showPath);

  if (!seasonsMap.has(seasonId))
    return errorService(
      Error.High,
      `\n${timeStamp()} -- getEpisodeId Error:\n ${showPath} does not have a Season directory within it with the ID of ${showId}`
    );

  const seasonPath = seasonsMap.get(showId);
  const seasonIsDir = await isDir(seasonPath ?? ``);

  if (!seasonPath || !seasonIsDir)
    return errorService(
      Error.High,
      `\n${timeStamp()} -- getEpisodeId Error:\n ${showPath} is not a directory within ${
        process.env.TV_DIR
      }`,
      slackConfig
    );

  const episodes = await filesMap(seasonPath);

  console.log(episodes);
}

main();
