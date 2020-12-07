import { Query, Resolver } from 'type-graphql';
import { Movie } from '../entities/movie.entity';

@Resolver(Movie)
export class MovieResolver {
  // TODO: Create pg MovieService here
  constructor(private movieService) {}

  @Query(() => [Movie])
  async movies(): Promise<Movie[]> {
    return this.movieService.findAll();
  }
}
