import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

config();

function getMovies(): Promise<string[]> {
  return new Promise((res, rej) => {
    fs.readdir(process.env.MOVIES_DIR, (err, files) => {
      if (err) throw err;
      return res(
        files.filter((file) => {
          const id = file.split(`[`)[0].replace(`]`, ``).trim();
          return !files.includes(`.[${id}].json`);
        })
      );
    });
  });
}

getMovies()
  .then((res) => console.log(res))
  .catch(console.error);

// axios
//   .get(
//     `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=Fight+Club`
//   )
//   .then(({ data }) =>
//     axios.get(
//       `https://api.themoviedb.org/3/movie/${data.results[0].id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos`
//     )
//   )
//   .then(({ data }) => {
//     console.log(data);
//     const metadata = JSON.stringify({
//       id: data.id,
//       title: data.title,
//       backdrop: `${process.env.TMDB_IMAGES}${data.backdrop_path}`,
//       overview: data.overview,
//       poster: `${process.env.TMDB_IMAGES}${data.poster_path}`,
//       genres: data.genres.map(({ name }: { name: string }) => name),
//       relase: new Date(data.release_date).getFullYear(),
//       trailers: data.videos,
//     });
//     return fs.writeFile(
//       `${path.resolve(__dirname)}/.Fight_Club.json`,
//       metadata,
//       () => console.log(`done`)
//     );
//   })
//   .catch(console.error);
