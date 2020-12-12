import puppeteer from 'puppeteer';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { timeStamp } from './logger';
import { ImageExtensions } from '../types/images.types';
import { WebClient } from '@slack/web-api';

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

const Slackbot = new WebClient(process.env.BACKGROUNDS_SLACK_BOT);

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
    fs.readdir(process.env.BACKGROUNDS_DIR ?? `NULL`, (err, files) =>
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

function slackPost(bot: WebClient, text: string) {
  return new Promise((res) =>
    bot.chat
      .postMessage({ channel: `backgrounds`, text })
      .then(res)
      .catch((err) => {
        console.error(err);
        res();
      })
  );
}

Promise.all([getNewWallpapers(), getCurrentWallpapers()])
  .then(([newResults, current]) => {
    const downloads = newResults.filter(
      ({ name, ext }) =>
        !current.has(name) && Object.keys(ImageExtensions).includes(ext)
    );
    return Promise.all(downloads.map(downloadImage));
  })
  .then((newDownloads) =>
    Promise.all(
      newDownloads.map(({ name, success }) =>
        slackPost(
          Slackbot,
          `${timeStamp()} -- ${
            success ? `${name} was downloaded` : `${name} was not downloaded`
          }`
        )
      )
    )
  )
  .catch(console.error);
