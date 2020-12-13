import { WebAPICallResult } from '@slack/web-api';
import { timeStamp } from 'console';
import fs from 'fs';
import { Error } from '../types/errors.types';
import { SlackbotDTO } from '../types/slack.types';

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
          Error.Medium,
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
): Promise<WebAPICallResult | void> | void {
  switch (errLevel) {
    case Error.Low:
      return console.error(message);
    case Error.Medium:
      console.error(message);
      return slackbot?.bot.chat
        .postMessage({
          channel: slackbot.channel,
          text: message,
        })
        .catch(console.error);
    case Error.High:
      console.error(message);
      return slackbot?.bot.chat
        .postMessage({
          channel: slackbot.channel,
          text: message,
        })
        .then(() => process.exit(1))
        .catch(console.error);
  }
}

export function getFileId(file: string): number {
  const stringSplit = file.split(`[`);
  const id = stringSplit[1].split(`]`)[0];
  return Number(id);
}