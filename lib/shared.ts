import { timeStamp } from 'console';
import axios from 'axios';
import fs from 'fs';
import { Error } from '../types/errors.types';
import { SlackbotDTO } from '../types/slack.types';
import { sortEpisodeDTO } from '../types/tv.types';

export function filesMap(dir: string): Promise<Map<string, null>> {
  return new Promise((res, rej) =>
    fs.readdir(dir, (err, files) =>
      err ? rej(err) : res(new Map(files.map((file) => [file, null])))
    )
  );
}

export function directoryMap(dir: string): Promise<Map<number, string>> {
  return new Promise((res, rej) =>
    fs.readdir(dir, (err, files) =>
      err
        ? rej(err)
        : res(new Map(files.map((file) => [getFileId(file), file])))
    )
  );
}

export function isDir(file: string): Promise<boolean> {
  return new Promise((res) =>
    fs.lstat(file, (err, stats) => {
      if (err)
        errorService(
          Error.Warn,
          `${timeStamp()} -- isDir Error:\n ${file} couldn't be read within the isDir function`
        );
      return res(stats.isDirectory() ?? false);
    })
  );
}

export function errorService(
  errLevel: Error,
  message: string,
  slackbot?: SlackbotDTO
): Promise<void> | void {
  switch (errLevel) {
    case Error.Warn:
      return console.error(message);
    case Error.Exit:
      console.error(message);
      return slackbot?.bot.chat
        .postMessage({
          channel: slackbot.channel,
          text: message.toString(),
        })
        .then(() => process.exit(1))
        .catch(console.error);
  }
}

export function getFileId(file: string): number {
  if (!file.includes(`[`)) return -1;
  const stringSplit = file.split(`[`);
  const id = stringSplit[1]?.split(`]`)[0];
  return Number(id);
}

export function sortEpisodes(episodes: string[]): sortEpisodeDTO[] {
  return episodes
    .map((episode) => ({
      episode,
      count:
        Number(episode.split(`E`)[0].replace(/S/g, ``)) * 10 +
        Number(episode.split(`E`)[1]),
    }))
    .sort((a, b) => (a.count > b.count ? 1 : -1));
}

export function getSeasonInfo(
  seasonId: number
): Promise<Record<string, unknown>> {
  return axios
    .get(
      `https://api.themoviedb.org/3/find/${seasonId}?api_key=${process.env.TMDB_API_KEY}`
    )
    .then(({ data }) => data);
}
