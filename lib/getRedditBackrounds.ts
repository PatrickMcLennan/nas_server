import puppeteer from 'puppeteer';
import { config } from 'dotenv';
import fs from 'fs';
import Slackbot from 'slackbots';
import path from 'path';
import https from 'https';
import { timeStamp } from './logger';
import { ImageExtensions } from '../types/images.types';

/**
 * Scrape Reddit for new Ultrawide wallpapers, download new posts
 * that aren't ads or NSFW.  Post the results to my slack sever.
 */

/**
 * TODO:
 *      - Add existing "ignore" list ability
 */

config({ path: path.resolve(__dirname, `../../.env`) });

type ScrapedResult = {
  url: string;
  name: string;
  ext: string;
};

const URL = `https://old.reddit.com/r/widescreenwallpaper`;
const SLACK_CHANNEL = `backgrounds`;

async function getNewWallpapers(): Promise<ScrapedResult[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: `networkidle0` });

  const results = await page.evaluate(() => {
    const allPosts = Array.from(document.querySelectorAll(`.thing`));
    const newPosts = allPosts.filter(
      (post) =>
        post.getAttribute(`data-promoted`)?.trim().toLowerCase() !== `true` &&
        post.getAttribute(`data-nsfw`)?.trim().toLowerCase() !== `true`
    );

    return newPosts.map((post) => {
      return {
        url: post.getAttribute(`data-url`) ?? `NULL`,
        name:
          post
            .querySelector(`[data-event-action="title"]`)
            ?.textContent?.trim()
            .toLowerCase()
            .replace(/ /g, `-`)
            .replace(/\*/g, `-`)
            .replace(/\//g, `-`)
            .replace(/\[/g, `-`)
            .replace(/\]/g, `-`)
            .replace(/\|/g, `-`)
            .replace(/@/g, `-`) ?? `NULL`,
        ext:
          post.getAttribute(`data-url`)?.split(`.`)[
            post.getAttribute(`data-url`)?.split(`.`).length - 1
          ] ?? `NULL`,
      };
    });
  });

  await browser.close();
  return results;
}

function getCurrentWallpapers(): Promise<Map<string, null>> {
  return new Promise((res, rej) =>
    fs.readdir(
      //   process.env.BACKGROUNDS_DIR ??
      path.resolve(__dirname, `./`),
      (err, files) =>
        err ? rej(err) : res(new Map(files.map((file) => [file, null])))
    )
  );
}

function downloadImage({
  url,
  name,
  ext,
}: ScrapedResult): Promise<{ name: string; success: boolean }> {
  return new Promise((res) => {
    const dest = path.join(
      // process.env.BACKGROUNDS_DIR ?? NULL
      path.resolve(),
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

function slackBot() {
  return new Promise((res, rej) => {
    const bot = new Slackbot({
      token: process.env.BACKGROUNDS_SLACK_BOT ?? `NULL`,
      name: `backgrounds-logger`,
    });

    bot.on(`start`, () =>
      bot.postMessageToChannel(
        SLACK_CHANNEL,
        `${timeStamp()} -- Starting to scrape ${URL}`
      )
    );

    bot.on(`error`, console.error);
    return bot ? res(bot) : rej(`There was an error making the bot`);
  });
}

Promise.all([getNewWallpapers(), getCurrentWallpapers()])
  .then(([newResults, current]) => {
    const downloads = newResults.filter(
      ({ name, ext }) =>
        !current.has(name) && Object.keys(ImageExtensions).includes(ext)
    );
    return Promise.all([slackBot(), ...downloads.map(downloadImage)]);
  })
  .then(([bot, ...downloads]) =>
    downloads.forEach((download) =>
      bot.postMessageToChannel(
        SLACK_CHANNEL,
        `${timeStamp()} -- ${
          download.success
            ? `${name} was downloaded`
            : `There was an issue downloading ${name}`
        }`
      )
    )
  )
  .catch(console.error);
