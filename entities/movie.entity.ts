import { Field, ObjectType } from 'type-graphql';
import { Base } from './base.entity';

@ObjectType({ description: `Movies` })
export class Movie extends Base {
  @Field()
  title!: string;

  @Field({ nullable: true })
  backdrop!: string;

  @Field({ nullable: true })
  overview!: string;

  @Field()
  path!: string;

  @Field({ nullable: true })
  poster!: string;

  @Field(() => [String])
  genres!: string[];

  @Field()
  releaseDate!: string;

  //   @Field()
  //   trailers!: Record<string, unknown>[];
}
