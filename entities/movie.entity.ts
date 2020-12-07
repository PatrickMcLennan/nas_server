import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: `Movies` })
export class Movie {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  backdrop!: string;

  @Field({ nullable: true })
  overview!: string;

  @Field()
  path!: string;

  @Field()
  poster!: string;

  @Field(() => [String])
  genres!: string[];

  @Field()
  release!: string;

  //   @Field()
  //   trailers!: Record<string, unknown>[];
}
