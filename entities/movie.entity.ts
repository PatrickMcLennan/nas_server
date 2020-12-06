import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './base.entity';

@ObjectType()
@Entity()
export class Movie extends Base {
  @Field()
  @Property()
  backdropPath: string;

  @Field()
  @Property()
  genres: string[];

  @Field()
  @PrimaryKey()
  id: string;

  @Field()
  @Property()
  overview: string;

  @Field()
  @Property()
  posterPath: string;

  @Field()
  @Property()
  title: string;
}
