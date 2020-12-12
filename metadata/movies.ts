import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

config({ path: path.resolve(__dirname, `../../.env`) });

/**
 * A Cron script to keep whatever DB method I choose up to date with the files actually on the harddrive.
 *
 * Scan the directory, pick up on new ID's, make an entry for each.
 */

type FileInfo = {
  name: string;
  id: string;
  ext: string;
};

function fileInfo(movie: string): FileInfo {
  return {
    name: movie.split(`[`)[0]?.trim(),
    id: movie.split(`[`)[1]?.split(`].`)[0]?.trim(),
    ext: path.extname(movie),
  };
}

function getNewMovies(): Promise<FileInfo[]> {
  return new Promise((res, rej) => {
    fs.readdir(process.env.MOVIES_DIR ?? `nothing`, (filesErr, files) =>
      fs.readdir(process.env.MOVIES_JSON ?? `nothing`, (jsonErr, json) => {
        if (filesErr || jsonErr) {
          filesErr &&
            console.error(`Problem reading ${process.env.MOVIES_DIR}`);
          jsonErr &&
            console.error(`Problem reading ${process.env.MOVIES_JSON}`);
          rej();
        }
        const jsonMap = new Map();
        if (Array.isArray(json))
          json.forEach((jsonFile) => jsonMap.set(jsonFile, ``));
        const newMovies = files.reduce((all: FileInfo[], current: string) => {
          const file = fileInfo(current);
          return jsonMap.has(`.[${file.id}].json`) || !file.id
            ? all
            : [file, ...all];
        }, []);
        return res(newMovies);
      })
    );
  });
}

// Temporary project approach -- Store metadata in JSON documents.
// I should use Mongo for this, but soon I'll be moving to postgres anyways.

function makeJSON({ id, name, ext }: FileInfo): Promise<string | Error> {
  return new Promise((res, rej) =>
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=videos`
      )
      .then(({ data }) => {
        // TODO: Ping the postgres API with this when it's ready instead
        const metadata = JSON.stringify({
          id: data.id,
          title: data.title,
          backdrop: `${process.env.TMDB_IMAGES}${data.backdrop_path}`,
          overview: data.overview,
          path: `${process.env.MOVIES_DIR}/${name} [${id}].${ext}`,
          poster: `${process.env.TMDB_IMAGES}${data.poster_path}`,
          genres: data.genres.map(({ name }: { name: string }) => name),
          releaseDate: new Date(data.release_date).getFullYear(),
          trailers: data.videos,
        });
        return fs.writeFile(
          `${path.resolve(process.env.MOVIES_JSON ?? `./`)}/.${id}.json`,
          metadata,
          () => res(`${name} is done => ${process.env.MOVIES_JSON}/.${id}.json`)
        );
      })
      .catch((error) => rej(error))
  );
}

getNewMovies()
  .then((newMovies) =>
    Promise.all(newMovies.map((newMovie) => makeJSON(newMovie)))
      .then(console.log)
      .catch(console.error)
  )
  .catch(console.error);
