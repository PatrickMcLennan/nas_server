import { EntityRepository } from '@mikro-orm/core';
import { Arg, Query, Resolver } from 'type-graphql';
import { Movie } from '../entities/movie.entity';

@Resolver(Movie)
export class MovieResolver {
  constructor(private movieRepository: EntityRepository<Movie>) {}

  @Query(() => [Movie])
  async movies(): Promise<Movie[]> {
    return await this.moviesCollection;
  }

  @Query(() => Movie)
  async movie(@Arg(`id`) id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ id });
    if (!movie) 
  }

  @Query(() => [Movie])
  async searchMovies(@Arg(`query`) query: string): Promise<Movie[]> {
    console.log(query);
    return await this.moviesCollection;
  }
}
