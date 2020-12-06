import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

config();

/**
 * A Cron script to keep whatever DB method I choose up to date with the files actually on the harddrive.
 *
 * Scan the directory, pick up on new ID's, make an entry for each.
 */

function getId(movie: string) {
  return movie.split(`[`)[0].replace(`]`, ``).trim();
}

function getNewMovies() {
  return new Promise((res, rej) => {
    fs.readdir(process.env.MOVIES_DIR ?? `nothing`, (err, files) => {
      if (err) throw err;
      const newMovies = files.reduce((all: string[], current: string) => {
        const id = getId(current);
        console.log(id);
        return files.includes(`.[${id}].json`) || !id ? all : [id, ...all];
      }, []);
      return res(newMovies);
    });
  });
}

function makeJSON(id: string): Promise<void> {
  return axios
    .get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=videos`
    )
    .then(({ data }) => {
      //   console.log(data);
      //   const metadata = JSON.stringify({
      //     id: data.id,
      //     title: data.title,
      //     backdrop: `${process.env.TMDB_IMAGES}${data.backdrop_path}`,
      //     overview: data.overview,
      //     path: `${process.env.MOVIES_DIR}`,
      //     poster: `${process.env.TMDB_IMAGES}${data.poster_path}`,
      //     genres: data.genres.map(({ name }: { name: string }) => name),
      //     relase: new Date(data.release_date).getFullYear(),
      //     trailers: data.videos,
      //   });
      //   return fs.writeFile(
      //     `${path.resolve(__dirname)}/.Fight_Club.json`,
      //     metadata,
      //     () => console.log(`done`)
      //   );
    })
    .catch(console.error);
}

async function main() {
  const newMovies = await getNewMovies();
}

main();
