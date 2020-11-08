import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

config();

function getId(movie: string) {
  return movie.split(`[`)[0].replace(`]`, ``).trim();
}

fs.readdir(process.env.MOVIES_DIR ?? `nothing`, (err, files) => {
  if (err) throw err;
  const newMovies = files.reduce((all: string[], current: string) => {
    const id = getId(current);
    console.log(id);
    return files.includes(`.[${id}].json`) || !id ? all : [id, ...all];
  }, []);
  return console.log(newMovies);
});

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
