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
const Slackbot = new WebClient(process.env.LOGGER_SLACK_BOT);
const slackConfig = { bot: Slackbot, channel: SlackChannels.Tv };

async function getEpisodes(): Promise<[string, Map<string, null>] | void> {
  const showsMap = await directoryMap(process.env.TV_DIR ?? `NULL`);

  if (!showsMap.has(showId))
    return errorService(
      Error.Exit,
      `\n${timeStamp()} -- getEpisodeId Error"\n The show ID ${showId} was not found within ${
        process.env.TV_DIR
      }`,
      slackConfig
    );

  const showPath = path.join(
    process.env.TV_DIR ?? `NULL`,
    showsMap.get(showId) ?? `NULL`
  );
  const showIsDir = await isDir(showPath ?? ``);

  if (!showPath || !showIsDir)
    return errorService(
      Error.Exit,
      `\n${timeStamp()} -- getEpisodeId Error:\n ${showPath} is not a directory within ${
        process.env.TV_DIR
      }`,
      slackConfig
    );

  const seasonsMap = await directoryMap(showPath);

  if (!seasonsMap.has(seasonId))
    return errorService(
      Error.Exit,
      `\n${timeStamp()} -- getEpisodeId Error:\n ${showPath} does not have a Season directory within it with the ID of ${seasonId}`,
      slackConfig
    );

  console.log(seasonsMap);
  console.log(showPath);
  console.log(showId, seasonId);

  const seasonPath = path.join(showPath, seasonsMap.get(seasonId) ?? `NULL`);
  const seasonIsDir = await isDir(seasonPath ?? ``);

  if (!seasonPath || !seasonIsDir)
    return errorService(
      Error.Exit,
      `\n${timeStamp()} -- getEpisodeId Error:\n ${showPath} is not a directory within ${
        process.env.TV_DIR
      }`,
      slackConfig
    );

    console.log(seasonPath)

  const episodes = await filesMap(seasonPath);

  return [seasonPath, episodes];
}

if (!showId || !seasonId)
  errorService(
    Error.Exit,
    `\n${timeStamp()} -- getEpisodeId Error:\n getEpisodeId was trying to be run without a Show ID and/or Season ID.  The files in these directories have to be formatted properly with their ID's in the name.\n`,
    slackConfig
  );
else
  getEpisodes()
    .then((something) => {
      const ids = 
    })
    .catch(console.error);
